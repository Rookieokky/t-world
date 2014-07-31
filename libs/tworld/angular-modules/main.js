var taskEnvironments = getEnvironments();
var agentPrograms = getAgentPrograms();

//ver si no mover esto a otro archivo (tal vez el auxiliar)
function getEnvironments(){return localStorage.taskEnvironments? JSON.parse(localStorage.taskEnvironments) : []}
function getAgentPrograms(){return localStorage.agentPrograms? JSON.parse(localStorage.agentPrograms) : []}
function saveEnvironments(){localStorage.taskEnvironments = JSON.stringify(taskEnvironments)}
function saveAgentPrograms(){localStorage.agentPrograms = JSON.stringify(agentPrograms)}
function clearEnvironments(){localStorage.removeItem("taskEnvironments")}
function clearAgentPrograms(){localStorage.removeItem("agentPrograms")}

function getEnvironmentByDate(date){
	var i = taskEnvironments.length;
	while (i--)
		if (taskEnvironments[i].date === date)
			return taskEnvironments[i];
	return null;
}

function getAgentProgramByDate(date){date=parseInt(date);
	var i = agentPrograms.length;
	while (i--)
		if (agentPrograms[i].date === date)
			return agentPrograms[i];
	return null;
}

function getKnobs(){return localStorage.knobs? JSON.parse(localStorage.knobs) : null}
function saveKnobs(knobs){
	localStorage.knobs = JSON.stringify(knobs);
	knobs.trial.test = false;
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

(function(){
	var main = angular.module("tworld", ['tworldMainMenu', 'tworldEnvironments', 'tworldAgentPrograms', 'ui.bootstrap', 'ui.slider', 'ngRoute', 'ngAnimate']);

	main.config(['$routeProvider', '$locationProvider', '$tooltipProvider',
		function($routeProvider, $locationProvider, $tooltipProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'main-manu.html',
					controller: 'MainMenuController',
					controllerAs: 'mmc'
				})
				.when('/environments', {
					templateUrl: 'environments.html',
					controller: 'EnvController',
					controllerAs: 'ec'
				})
				.when('/environments/new', {
					templateUrl: 'environments-new.html',
					controller: 'EnvNewController',
					controllerAs: 'enc'
				})
				.when('/agent-programs/new', {
					templateUrl: 'agent-programs-new.html',
					controller: 'AgentProgNewController',
					controllerAs: 'apnc'
				})
				.when('/agent-programs/source-code/:id', {
					templateUrl: 'agent-programs-source-code.html',
					controller: 'AgentProgSourceCodeController',
					controllerAs: 'apscc'
				})
				.otherwise({
					templateUrl: '404.html'
				});

			$tooltipProvider.options({
				appendToBody: true,
				//placement: 'left',
				popupDelay: 200
			});
		}]
	);

	main.controller("TWorldController", ["$sce", "$location",
		function($sce, $location){
			this.$loc = $location;
			this.LANGUAGES = _LANGUAGES;
			this.language = (window.navigator.userLanguage == 'es' || window.navigator.language == 'es')? this.LANGUAGES.SPANISH : this.LANGUAGES.ENGLISH;
			this.text = {menu:{}};
			this.taskEnvironments = taskEnvironments;
			this.agentPrograms = agentPrograms;

			this.goto = function(path){$location.url(path)}
			this.gotoTop = function(){
				$('html, body').animate({
					scrollTop: $("#top").offset().top
				}, 1000, "easeOutExpo")
			}

			this.getSubPath = function(fi){
				var subPath = "#";
				var _$subLoc = $location.url().split('/');

				for (var len= _$subLoc.length, i= 0; i < len; ++i)
					if (i <= fi)
						subPath+= (i > 0?"/":"") + _$subLoc[i]
					else
						return subPath;
			}

			this.setLanguage = function(){
				this.text.desc			= $sce.trustAsHtml($text.main.description[ this.language ]);
				this.text.martha_marc	= $sce.trustAsHtml($text.main.martha_marc[ this.language ]);
				this.text.cc			= $sce.trustAsHtml($text.main.ccLicense[ this.language ]);
				this.text.agpl			= $sce.trustAsHtml($text.main.agplLicense[ this.language ]);

				this.text.menu.btn_start	= $sce.trustAsHtml($text.main.menu.btn_start[ this.language ]);
				this.text.menu.envs			= $sce.trustAsHtml($text.main.menu.environments[ this.language ]);
				this.text.menu.envs.desc	= $sce.trustAsHtml($text.main.menu.environments.description[ this.language ]);
				this.text.menu.envs.btn_new	= $sce.trustAsHtml($text.main.menu.environments.btn_new[ this.language ]);
				this.text.menu.envs.btn_mng	= $sce.trustAsHtml($text.main.menu.environments.btn_manage[ this.language ]);
				this.text.menu.aps			= $sce.trustAsHtml($text.main.menu.agentPrograms[ this.language ]);
				this.text.menu.aps.desc		= $sce.trustAsHtml($text.main.menu.agentPrograms.description[ this.language ]);
				this.text.menu.aps.btn_new	= $sce.trustAsHtml($text.main.menu.agentPrograms.btn_new[ this.language ]);
				this.text.menu.aps.btn_mng	= $sce.trustAsHtml($text.main.menu.agentPrograms.btn_manage[ this.language ]);
				this.text.menu.sts			= $sce.trustAsHtml($text.main.menu.stats[ this.language ]);
				this.text.menu.sts.desc		= $sce.trustAsHtml($text.main.menu.stats.description[ this.language ]);
				this.text.menu.sts.btn_view	= $sce.trustAsHtml($text.main.menu.stats.btn_view[ this.language ]);
				this.text.menu.set			= $sce.trustAsHtml($text.main.menu.settings[ this.language ]);
				this.text.menu.set.desc		= $sce.trustAsHtml($text.main.menu.settings.description[ this.language ]);
				this.text.menu.set.btn_view	= $sce.trustAsHtml($text.main.menu.settings.btn_view[ this.language ]);
				this.text.menu.doc			= $sce.trustAsHtml($text.main.menu.documentation[ this.language ]);
				this.text.menu.doc.desc		= $sce.trustAsHtml($text.main.menu.documentation.description[ this.language ]);
				this.text.menu.doc.btn_read	= $sce.trustAsHtml($text.main.menu.documentation.btn_read[ this.language ]);
			}

			this.setLanguage();
		}
	]);
})();

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