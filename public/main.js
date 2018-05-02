/* global fin */
document.addEventListener('DOMContentLoaded', () => {
    const ofVersion = document.getElementById('no-openfin');
    if (typeof fin !== 'undefined') {
        init();
    } else {
        ofVersion.innerText = 'OpenFin is not available - you are probably running in a browser.';
    }
});

const applications = [
	{
		displayName: 'Yahoo Finance',
		manifestUrl: 'http://localhost:3000/yahoo.json'
	},
	{
		displayName: 'Apple',
		manifestUrl: 'http://localhost:3000/apple.json'
	}
]

function populateApplicationLinks() {
	const linksParent = document.getElementById('application-list');
	applications.forEach(application => {
		const applicationLink = document.createElement('div');
		applicationLink.innerText = application.displayName;
		applicationLink.onclick = () => {
			fin.desktop.Application.createFromManifest(application.manifestUrl,
				(app) => app.run(),
				(e) => console.log(e)
			);
		}
		linksParent.appendChild(applicationLink);
	})
}

function launchTwoAppsAndSplitMainScreen() {
	launchTwoApps().then(
		splitAppMainWindowsOnScreen
	);
}

function launchTwoApps() {
	return new Promise((res, rej) => {
		fin.desktop.Application.createFromManifest(applications[0].manifestUrl, 
			(app1) => {
				app1.run(() => {
					fin.desktop.Application.createFromManifest(applications[1].manifestUrl, (app2) => {
						app2.run(res);
					})
				})
			}
		)
	})
}

function splitAppMainWindowsOnScreen() {
	const app1Window = fin.desktop.Window.wrap('yahoo', 'yahoo');
	const app2Window = fin.desktop.Window.wrap('apple', 'apple');

	fin.desktop.System.getMonitorInfo(monitorInfo => {
		const mainMonitor = monitorInfo.primaryMonitor.availableRect;
		console.log(mainMonitor)
		app1Window.moveTo(mainMonitor.left, mainMonitor.top, 
			() => app1Window.resizeTo((mainMonitor.right / 2), mainMonitor.bottom - mainMonitor.top)
		)
		app2Window.moveTo(mainMonitor.right / 2, mainMonitor.top, 
			() => app2Window.resizeTo((mainMonitor.right / 2), mainMonitor.bottom - mainMonitor.top)
		)
	})
}

function init () {
    fin.desktop.System.getVersion(version => {
        console.log(version);
    });
	populateApplicationLinks();
	launchTwoAppsAndSplitMainScreen();
}
