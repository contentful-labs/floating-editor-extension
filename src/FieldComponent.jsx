import React from 'react';
import tokens from '@contentful/forma-36-tokens';
import PropTypes from 'prop-types';
import { css } from 'emotion';

const styles = {
  root: css({
    marginBottom: tokens.spacing2Xl,
    borderLeft: `3px solid ${tokens.colorElementDark}`,
    paddingLeft: tokens.spacingM
  }),
  name: css({
    color: tokens.colorTextLight,
    fontSize: tokens.fontSizeM,
    paddingBottom: tokens.spacingS
  })
};

export function FieldComponent({ item, children }) {
  return (
    <div className={styles.root}>
      <div className={styles.name}>{item.name}</div>
      {children}
    </div>
  );
}

FieldComponent.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.any
};
