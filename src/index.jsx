/* global process */

import React from 'react';
import { render } from 'react-dom';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
import { MultipleLineEditor } from '@contentful/field-editor-multiple-line';
import { JsonEditor } from '@contentful/field-editor-json';
import { NumberEditor } from '@contentful/field-editor-number';
import { BooleanEditor } from '@contentful/field-editor-boolean';
import { TagsEditor } from '@contentful/field-editor-tags';
import '@contentful/forma-36-react-components/dist/styles.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import './index.css';
import { FieldComponent } from './FieldComponent';
import { externalInit } from './sdk/createFakeAPI';

const styles = {
  root: css({
    minWidth: '400px',
    maxWidth: '1000px',
    width: '100%'
  }),
  internal: css({
    padding: tokens.spacing3Xl
  })
};

function renderEntryEditor(entrySdk) {
  const renderables = entrySdk.contentType.fields.map(field => {
    const result = {
      id: field.id,
      name: field.name
    };
    if (field.type === 'Symbol') {
      result.component = SingleLineEditor;
    } else if (field.type === 'Text') {
      result.component = MultipleLineEditor;
    } else if (field.type === 'Object') {
      result.component = JsonEditor;
    } else if (field.type === 'Number' || field.type === 'Integer') {
      result.component = NumberEditor;
    } else if (field.type === 'Boolean') {
      result.component = BooleanEditor;
    } else if (field.type === 'Array') {
      result.component = TagsEditor;
    } else {
      result.component = function NotExist() {
        return <div>widget for {field.type} does not exist</div>;
      };
    }
    return result;
  });

  render(
    <div className={styles.root}>
      <div className={styles.internal}>
        {renderables.map(item => {
          const field = entrySdk.entry.fields[item.id];
          const Component = item.component;
          field.onSchemaErrorsChanged = () => {
            return () => {};
          };
          field.setInvalid = () => {};
          return (
            <FieldComponent key={item.id} item={item}>
              <Component field={field} isInitiallyDisabled={false} />
            </FieldComponent>
          );
        })}
      </div>
    </div>,
    document.getElementById('root')
  );
}

externalInit(
  sdk => {
    renderEntryEditor(sdk);
  },
  {
    spaceId: process.env.SPACE,
    entryId: '1waQCQS7fLWGTr74WpOKZb'
  }
);

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
