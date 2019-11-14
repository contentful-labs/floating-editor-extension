import React from 'react';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
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
    } else if (field.type === 'Symbols') {
      result.component = TagsEditor;
    } else {
      result.component = function NotExist() {
        return <div>widget for {field.type} does not exist</div>;
      };
    }
    return result;
  });

  render(
    <div style={{ minHeight: 500, width: 1000, minWidth: 1000 }}>
      <div style={{ padding: 100 }}>
        {renderables.map(item => {
          const field = entrySdk.entry.fields[item.id];
          const Component = item.component;
          field.onSchemaErrorsChanged = () => {
            return () => {};
          };
          return (
            <div key={item.id} className="field">
              <div className="field-name">{item.name}</div>
              <Component field={field} />
            </div>
          );
        })}
      </div>
    </div>,
    document.getElementById('root')
  );
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    renderEntryEditor(sdk);
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
