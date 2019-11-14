import mitt from 'mitt';

export function createFakeFieldAPI({ field, onUpdate, initialValue }) {
  const emitter = mitt();

  let _value = initialValue;

  return {
    ...field,
    onValueChanged: fn => {
      emitter.on('onValueChanged', fn);
      return () => {
        emitter.off('onValueChanged', fn);
      };
    },
    onIsDisabledChanged: fn => {
      emitter.on('onIsDisabledChanged', fn);
      return () => {
        emitter.off('onIsDisabledChanged', fn);
      };
    },
    onSchemaErrorsChanged: fn => {
      emitter.on('onSchemaErrorsChanged', fn);
      return () => {
        emitter.off('onSchemaErrorsChanged', fn);
      };
    },
    getValue: () => {
      return _value;
    },
    setInvalid: () => {},
    setValue: value => {
      _value = value;
      emitter.emit('onValueChanged', _value);
      onUpdate(_value);
      return Promise.resolve();
    },
    removeValue: () => {
      _value = undefined;
      emitter.emit('onValueChanged', undefined);
      onUpdate(_value);
      return Promise.resolve();
    }
  };
}
