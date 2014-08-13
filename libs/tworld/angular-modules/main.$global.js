/*
* main.$global.js - 
*
* Copyright (C) 2014 Burdisso Sergio (sergio.burdisso@gmail.com)
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
var taskEnvironments = getEnvironments();
var agentPrograms = getAgentPrograms();


Array.prototype.remove = function(index) {
	var output=this[index];

	for (var i= index; i < this.length; ++i)
		this[i] = this[i+1];
	this.length--;

	return output;
}

Array.prototype.setTo = function(arr) {
	if (arr.length != this.length)
		this.length = arr.length;

	var i= this.length;
	while(i--)
		this[i] = arr[i];
}

function clone(obj){return JSON.parse(JSON.stringify(obj))}

function getEnvironments(){return localStorage.taskEnvironments? JSON.parse(localStorage.taskEnvironments) : []}
function getAgentPrograms(){return localStorage.agentPrograms? JSON.parse(localStorage.agentPrograms) : []}
function saveEnvironments(){localStorage.taskEnvironments = JSON.stringify(taskEnvironments)}
function saveAgentPrograms(){localStorage.agentPrograms = JSON.stringify(agentPrograms)}
function clearEnvironments(){localStorage.removeItem("taskEnvironments")}
function clearAgentPrograms(){localStorage.removeItem("agentPrograms")}

function getEnvironmentIndexByDate(date){date=parseInt(date);
	var i = taskEnvironments.length;
	while (i--)
		if (taskEnvironments[i].date === date)
			return i;
	return -1;
}
function getEnvironmentByDate(date){
	var i = getEnvironmentIndexByDate(date);
	return (i != -1)? taskEnvironments[i] : null;
}

function getAgentProgramIndexByDate(date){date=parseInt(date);
	var i = agentPrograms.length;
	while (i--)
		if (agentPrograms[i].date === date)
			return i;
	return -1;
}

function getAgentProgramByDate(date){date=parseInt(date);
	var i = getAgentProgramIndexByDate(date);
	return (i != -1)? agentPrograms[i] : null;
}

function getKnobs(){return localStorage.knobs? JSON.parse(localStorage.knobs) : null}
function saveKnobs(env, test){
	if (test) env.trial.test= true; //default trial (test trial)
	localStorage.knobs = JSON.stringify(env);
}
function clearKnobs(){localStorage.removeItem("knobs")}




var _tworldWindow;
function startTWorld(){
	if (!_tworldWindow || !_tworldWindow.window)
		_tworldWindow = window.open('tworld.html');//,'T-World','width=712, height=450');//height=400
	else
		_tworldWindow.location = 'tworld.html';
	_tworldWindow.focus();
}




function gotoTop(){
	$('html, body').animate({
		scrollTop: $("#top").offset().top
	}, 1000, "easeOutExpo")
}

function itemsListController($scope, $modalInstance, items, agentProgramsFlag){
	var _selected = -1;

	$scope.items = items;
	$scope.orderCond = "-date";
	$scope.environments = !agentProgramsFlag;
	$scope.query = agentProgramsFlag?
				{
					name:"",
					ai:true,
					javascript:true,
					keyboard:true,
					allProps: true,
				}
				:
				{
					name:"",
					allProps: true,
					battery: false,
					prop: {
						fullyObservable: true,
						multiagent: false,
						deterministic: true,
						dynamic: 0, //0 static; 1 semidynamic; 2 dynamic
						known: true
					}
				};

	$scope.text = {
		title: agentProgramsFlag? "Select An Agent Program" : "Select A Task Environment",
		filter: agentProgramsFlag? "Only Agent Programs that are:" : "Only Task environments that are:"
	}

	$scope.ok = function () {$modalInstance.close(_selected)};
	$scope.close = function () {$modalInstance.dismiss()};

	$scope.setSelected = function(value){_selected = value}
	$scope.isSelected = function(value){return _selected == value}
	$scope.userFilter = function(item){
		var regEx = new RegExp($scope.query.name,"i");

		if (agentProgramsFlag){
			var q = $scope.query;
			return regEx.test(item.name) && (
					$scope.query.allProps ||
					(
						q.ai == item.ai && (
							(q.ai && q.javascript == item.javascript)
							||
							(!q.ai && q.keyboard == item.keyboard)
						)
					)
				);
		}else{
			var p = $scope.query.prop;
			return regEx.test(item.name) && (
					$scope.query.allProps ||
					(
						$scope.query.battery == item.battery &&
						p.fullyObservable == item.prop.fullyObservable &&
						p.multiagent == item.prop.multiagent &&
						p.deterministic == item.prop.deterministic &&
						p.dynamic == item.prop.dynamic &&
						p.known == item.prop.known
					)
			);
		}
	}
};

function runModalController($scope, $modal, $modalInstance, taskEnv, agentProgs){
	$scope.task_env = taskEnv;
	$scope.agents = $scope.task_env.trial.agents;
	$scope.teams = new Array(taskEnv.teams.length);
	$scope.cameras = _CAMERA_TYPE;

	$scope.run = function () {
		$scope.task_env.trial.agents = $scope.agents;
		$scope.task_env.trial.test= false;

		saveKnobs($scope.task_env);
		saveEnvironments();

		startTWorld();
		$modalInstance.close()
	};
	$scope.close = function () {$modalInstance.dismiss()};

	$scope.singleTeam = function(){return $scope.task_env.teams.length === 1}
	$scope.singleAgent = function(){return !$scope.task_env.prop.multiagent}

	$scope.selectAgentProgram = function(agent_id){
		var modalInstance = $modal.open({
				size: 'lg',//size,
				templateUrl: 'items-list-modal.html',
				controller: itemsListController,
				resolve:{
					items:function(){return agentPrograms},
					agentProgramsFlag:function(){return true}
				}
			});

		modalInstance.result.then(
			function (agent_program_id) {
				if (!$scope.agents[agent_id].program || $scope.agents[agent_id].program.date != agent_program_id)
					$scope.agents[agent_id].program = getAgentProgramByDate(agent_program_id); 
			}
		);
	}

	//updating previously saved list of agents and teams (from the last execution)
	for (var a=$scope.agents.length; a--;)
		if ($scope.agents[a].program)
			$scope.agents[a].program = getAgentProgramByDate($scope.agents[a].program.date)

	//initializing list of agents and teams
	for (var elen=taskEnv.teams.length, a=0, t=0; t < elen; ++t){
		$scope.teams[t] = new Array(taskEnv.teams[t].members)
		for (var tlen=$scope.teams[t].length, m=0; m < tlen; ++m, ++a){
			if ($scope.agents.length <= a)
				$scope.agents.push(null);

			if (!$scope.agents[a])
				$scope.agents[a] = {
					team: t,
					id: a,
					program: agentProgs[a]
				};
			else
				if (agentProgs[a])
					$scope.agents[a].program = agentProgs[a];

			$scope.teams[t][m] = $scope.agents[a];
		}
	}

}

function toggleFullScreen(e) {
	var d = document;
	var _requestFullScreen =e.requestFullScreen			|| e.requestFullscreen		||
							e.msRequestFullScreen		|| e.msRequestFullscreen	||
							e.mozRequestFullScreen		|| e.mozRequestFullscreen	||
							e.webkitRequestFullScreen	|| e.webkitRequestFullscreen;
	var _cancelFullScreen =	d.cancelFullScreen			|| d.cancelFullscreen		|| d.exitFullScreen			|| d.exitFullscreen			||
							d.msCancelFullScreen		|| d.msCancelFullscreen		|| d.msExitFullScreen		|| d.msExitFullscreen		||
							d.mozCancelFullScreen		|| d.mozCancelFullscreen	|| d.mozExitFullScreen		|| d.mozExitFullscreen		||
							d.webkitCancelFullScreen	|| d.webkitCancelFullscreen	|| d.webkitExitFullScreen	|| d.webkitExitFullscreen;

	if ( d.fullscreenElement	|| d.webkitFullscreenElement ||
		 d.mozFullScreenElement	|| d.msFullscreenElement) {
		if (_cancelFullScreen){
			$(e).removeClass("full-screen");
			_cancelFullScreen.call(d);
		}
	}else
		if (_requestFullScreen){
			$(e).addClass("full-screen");
			_requestFullScreen.call(e);
		}
}