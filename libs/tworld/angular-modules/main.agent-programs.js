/*
* main.environments.new.js - 
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
(function(){
	var mod = angular.module('tworldAgentPrograms', []);

	var formats = []; for (p in _PERCEPT_FORMAT) formats.push(p);

	mod.controller("AgentProgController", ["$location", "$modal", function($location, $modal){
		var _self = this;
		var _selected = -1;

		this.agentPrograms = agentPrograms;
		this.orderCond = "-date";
		this.allProps = true;
		this.query = {
			name:"",
			battery: false,
			prop: {
				fullyObservable: true,
				multiagent: false,
				deterministic: true,
				dynamic: 0, //0 static; 1 semidynamic; 2 dynamic
				known: true
			}
		};

		this.setSelected = function(value){_selected = value}
		this.isSelected = function(value){return _selected == value}

		this.remove = function(){
			for (var t=agentPrograms.length; t--;)
				if (agentPrograms[t].date == _selected)
					agentPrograms.remove(t);
			saveAgentPrograms();
		}

		this.run = function(){
			var modalInstance = $modal.open({
						size: 'lg',//size,
						templateUrl: 'items-list-modal.html',
						controller: itemsListController,
						resolve:{
							items:function(){return taskEnvironments},
							agentProgramsFlag:function(){return false}
						}
					});

			modalInstance.result.then(
				function (id) {
					$modal.open({
						size: 'lg',//size,
						templateUrl: 'run-modal.html',
						controller: runModalController,
						resolve:{
							taskEnv: function(){return getEnvironmentByDate(id)}, 
							agentProgs: function(){return [getAgentProgramByDate(_selected)]}
						}
					});
				}
			);
		}

		this.editor = function(agent_prog){return (agent_prog && agent_prog.ai && agent_prog.javascript)}

		this.userFilter = function(task_env){
			var regEx = new RegExp(_self.query.name,"i");
			var p = _self.query.prop;
			return regEx.test(task_env.name) && (
					_self.allProps ||
					(
						_self.query.battery == task_env.battery &&
						p.fullyObservable == task_env.prop.fullyObservable &&
						p.multiagent == task_env.prop.multiagent &&
						p.deterministic == task_env.prop.deterministic &&
						p.dynamic == task_env.prop.dynamic &&
						p.known == task_env.prop.known
					)
			);
		}

	}]);

	mod.controller('AgentProgSourceCodeController', ['$routeParams','$modal', '$location',
		function($routeParams, $modal, $location){
			var _self = this;

			this.agent_prog = getAgentProgramByDate($routeParams.id);
			if (!this.agent_prog.ai || !this.agent_prog.javascript){$location.url('/404');return}

			this.task_env = this.agent_prog.default_task_env?
								getEnvironmentByDate(this.agent_prog.default_task_env)
								:
								null;

			editor.setValue(this.agent_prog.source.code);
			editor.focus();
			editor.gotoLine(this.agent_prog.source.cursor.row+1, this.agent_prog.source.cursor.column, true);
			editor.scrollToRow(this.agent_prog.source.cursor.row);

			this.save = function(){
				this.agent_prog.source.cursor = editor.getCursorPosition();
				this.agent_prog.source.code = editor.getValue();
				saveAgentPrograms()
			}

			this.run = function(){
				if (!this.task_env)
					this.openEnvironmentsModal(true);
				else
					this.openRunModal();
			}

			this.openEnvironmentsModal = function(run){
				var modalInstance = $modal.open({
						size: 'lg',//size,
						templateUrl: 'items-list-modal.html',
						controller: itemsListController,
						resolve:{
							items:function(){return taskEnvironments},
							agentProgramsFlag:function(){return false}
						}
					});

				modalInstance.result.then(
					function (id) {
						if (!_self.task_env && run){
							_self.task_env = getEnvironmentByDate(id);
							_self.openRunModal();
						}else
							_self.task_env = getEnvironmentByDate(id);

						_self.agent_prog.default_task_env = id;
					}
				);
			}

			this.openRunModal = function(){
				$modal.open({
						size: 'lg',//size,
						templateUrl: 'run-modal.html',
						controller: runModalController,
						resolve:{
							taskEnv: function(){return _self.task_env}, 
							agentProgs: function(){return [_self.agent_prog]}
						}
					});
			}
		}]
	);

	mod.controller('AgentProgNewController', ['$location',
		function($location){
			var _self = this;

			this.PERCEPT_FORMAT = _PERCEPT_FORMAT;

			this.perceptFormats = formats;
			this.agent_prog = {
				name:"",
				desc:"",
				date:0,
				team:-1,
				ai: true,
				javascript:true,
				source:{
					code: "function AgentProgram(percept){\n\t\n}",
					msg_code: "function onMsgReceived(msg){\n\t\n}",
					cursor:{row:0, column:0}
				},
				socket:{
					ip_address: "localhost",
					port:3313,
					magic_string: "",
					percept_format: _PERCEPT_FORMAT.JSON
				},
				keyboard:true,
				controls:{Up:38, Down:40, Left:37, Right:39, Restore:16},
				prop: {
					fullyObservable: true,
					multiagent: false,
					multiagent_type: 0, //0 competitive; 1 cooperative; 2 both
					deterministic: true,
					dynamic: 0, //0 static; 1 semidynamic; 2 dynamic
					known: true
				}
			}

			this.save = function(){
				this.agent_prog.date = Date.now();
				agentPrograms.push(this.agent_prog);
				saveAgentPrograms();
				if (this.agent_prog.javascript && this.agent_prog.ai)
					$location.url('/agent-programs/source-code/'+this.agent_prog.date)
				else
					$location.url('/');

				gotoTop();
			}

			this.nameUpdate = function(){
				if ($("#magic-string").hasClass("ng-pristine"))
					this.agent_prog.socket.magic_string = this.agent_prog.name;
			}
	}]);

})();
