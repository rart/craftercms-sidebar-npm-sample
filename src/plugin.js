import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.CStudioAuthoring.Module.moduleLoaded('sidebar', {
  initialize(config) {
    ReactDOM.render(
      React.createElement(App),
      config.containerEl
    );
  }
});

// Add this snippet to "Sidebar Configuration" modulehooks section
// <modulehook>
// 	<plugin>
// 		<type>apps</type>
// 		<name>sidebar</name>
// 		<file>bundle.js</file>
// 	</plugin>
// 	<params />
// </modulehook>`
