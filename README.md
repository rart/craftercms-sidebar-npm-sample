# Sample sidebar plugin for 3.1.x

This plugin shows how you can comfortably develop locally and then deploy to craftercms.

You can `yarn start` to run the app in dev mode, develop, test and once you're done, run `yarn build:plugin`. 
This will produce a `bundle.js` file on the root of this project which you can then copy into your Crafter site 
`{sandbox}/config/studio/plugins/apps/sidebar` directory **and commit it**.

Then, you'd go to your "Sidebar Config" xml config file and add the snippet below on the `modulehooks` section.
```xml
<modulehook>
	<plugin>
		<type>apps</type>
		<name>sidebar</name>
		<file>bundle.js</file>
	</plugin>
	<params />
</modulehook>
```
You should then see this render on the sidebar.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build:plugin`

Builds and bundles the plugin to make it ready for deployment to your Crafter site.
