/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect } from 'react';
import { useSpreadState } from '@craftercms/studio-ui/utils/hooks';
import { useStyles } from './styles';
import PathNavigatorUI
  from '@craftercms/studio-ui/components/Navigation/PathNavigator/PathNavigatorUI';
import { getLegacyItemsTree } from '@craftercms/studio-ui/services/content';
import { map, switchMap } from 'rxjs/operators';
import { parseLegacyItemToDetailedItem } from '@craftercms/studio-ui/utils/content';
import { createLookupTable } from '@craftercms/studio-ui/utils/object';
import { getIndividualPaths, withoutIndex } from '@craftercms/studio-ui/utils/path';
import { setRequestForgeryToken } from '@craftercms/studio-ui/utils/auth';
import I18nProvider from '@craftercms/studio-ui/components/I18nProvider/I18nProvider';
import CrafterThemeProvider
  from '@craftercms/studio-ui/components/CrafterThemeProvider/CrafterThemeProvider';
import Suspencified from '@craftercms/studio-ui/components/SystemStatus/Suspencified';
import { exists } from '@craftercms/studio-ui/services/sites';
import { createGenerateClassName } from '@material-ui/styles';

const SITE_NAME = 'editorial';

setRequestForgeryToken();

// Necessary in Crafter v4 to avoid colliding with Studio's classes
const generateClassName = createGenerateClassName({
  productionPrefix: 'sidebar-plugin-'
});

function App() {

  const classes = useStyles();
  const [itemLookup, setItemLookup] = useSpreadState({});
  const [state, setState] = useSpreadState({
    id: 'sidebarSample',
    label: 'Sidebar Sample',
    rootPath: '/site/components/left-rails',
    currentPath: '/site/components/left-rails',
    localeCode: null,
    keyword: '',
    isSelectMode: false,
    hasClipboard: false,
    levelDescriptor: null,
    itemsInPath: [],
    breadcrumb: [],
    selectedItems: [],
    leaves: [],
    count: null, // Number of items in the current path; null to hide pagination element
    limit: 5,
    offset: 0,
    collapsed: false
  });

  useEffect(() => {
    exists(SITE_NAME).pipe(
      switchMap((exists) => {
        if (!exists) {
          setTimeout(() => alert(`The "${SITE_NAME}" site doesn't exist.`));
        }
        return exists ? getLegacyItemsTree(SITE_NAME, state.currentPath, { depth: 1 }) : [null];
      }),
      map((item) => {
        if (item) {
          const levelDescriptor = item.children.find((item) => item.contentType === '/component/level-descriptor');
          return Object.assign(parseLegacyItemToDetailedItem(item.children), {
            parent: parseLegacyItemToDetailedItem(item),
            levelDescriptor: levelDescriptor
              ? {
                ...parseLegacyItemToDetailedItem(levelDescriptor),
                label: 'Section Defaults'
              }
              : null
          });
        } else {
          return Object.assign([], {
            parent: null,
            levelDescriptor: null
          })
        }
      })
    ).subscribe((response) => {
      if (response.length) {
        let items = [...response];
        if (response.parent) {
          items.push(response.parent);
        }
        if (response.levelDescriptor) {
          items.push(response.levelDescriptor);
        }
        setItemLookup(createLookupTable(items));
        setState({
          breadcrumb: getIndividualPaths(withoutIndex(state.currentPath), state.rootPath),
          itemsInPath: response.map(i => i.path),
          levelDescriptor: response.levelDescriptor?.path,
          // count: response.length // Leave null to hide pagination element
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspencified>
      <I18nProvider>
        <CrafterThemeProvider generateClassName={generateClassName}>
          <section className={classes.root}>
            <PathNavigatorUI
              state={state}
              itemsByPath={itemLookup}
              // Styling props (classes and/or styles) applied to the widget's header icon element
              icon={{ baseClass: 'fa fa-bath' }}
              // Styling props (classes and/or styles) applied to the widget's container element
              // container={{}}
              title={state.label}
              // Indents all items of the widget wrapping them with a border on the left of the widget
              showChildrenRail
              //
              // classes={{}}
              //
              // siteLocales={null}
              // Prop called to determine which items are highlighted as active/selected
              computeActiveItems={() => ['/site/components/left-rails/left-rail-with-no-articles.xml']}
              // Prop fired when the widget/accordion header is clicked
              onChangeCollapsed={(collapsed) => setState({ collapsed })}
              // Prop fired when either button of the widget header is clicked (language or options button)
              // onHeaderButtonClick={(elem: Element, type: 'options' | 'language') => console.log('onHeaderButtonClick')}
              // Prop fired when the current directory item menu is clicked
              // onCurrentParentMenu={() => console.log('onCurrentParentMenu')}
              // Prop fired when the search button is clicked
              // onSearch={() => console.log('onSearch')}
              // Prop fired when a breadcrumb item is clicked
              onBreadcrumbSelected={() => console.log('onBreadcrumbSelected')}
              // Prop fired when an item is checked in when the widget is in "selection" mode
              // onSelectItem={() => console.log('onSelectItem')}
              //
              onPathSelected={() => console.log('onPathSelected')}
              // Prop fired when the widget determines the clicked item is "previewable". It may be fired by the widget's default onItemClicked handler or via the "view" button of each item when the clicked item is not a folder
              // onPreview={() => console.log('onPreview')}
              // Prop fired when a list item options button is clicked
              // onOpenItemMenu={() => console.log('onOpenItemMenu')}
              // Prop fired when a list item itself is clicked (anywhere but it's buttons)
              // onItemClicked={() => console.log('onItemClicked')}
              // onPageChanged={() => console.log('onPageChanged')}
            />
          </section>
        </CrafterThemeProvider>
      </I18nProvider>
    </Suspencified>
  );
}

export default App;
