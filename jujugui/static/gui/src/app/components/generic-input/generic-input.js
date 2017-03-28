/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2016 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

YUI.add('generic-input', function() {

  juju.components.GenericInput = React.createClass({

    propTypes: {
      autocomplete: React.PropTypes.bool,
      disabled: React.PropTypes.bool,
      errors: React.PropTypes.bool,
      inlineError: React.PropTypes.bool,
      label: React.PropTypes.string,
      multiLine: React.PropTypes.bool,
      onBlur: React.PropTypes.func,
      onKeyUp: React.PropTypes.func,
      onFocus: React.PropTypes.func,
      placeholder: React.PropTypes.string,
      required: React.PropTypes.bool,
      type: React.PropTypes.string,
      validate: React.PropTypes.array,
      value: React.PropTypes.string,
    },

    getDefaultProps: () => {
      return {
        autocomplete: true,
        required: false,
        type: 'text'
      };
    },

    getInitialState: function() {
      return {errors: null, focus: false};
    },

    /**
      Validate the field value.

      @param {Object} evt The trigger event.
      @method validate
    */
    validate: function(evt) {
      const validate = this.props.validate;
      if (!validate) {
        if (this._onKeyUp) {
          this._onKeyUp(evt);
        }
        // If there are no validators then this field should always be valid.
        return true;
      }
      var value = this.getValue();
      var errors = [];
      var components;
      this.props.validate.forEach((validator) => {
        if (!validator.regex.test(value)) {
          var error = validator.error;
          errors.push(
            <li className="generic-input__error"
              key={error}
              role="alert">
              {error}
            </li>);
        }
      });
      if (errors.length > 0) {
        components = (
          <ul className="generic-input__errors">
            {errors}
          </ul>);
      }
      // Have to always set the state in case there used to be errors, but are
      // no longer.
      this.setState({errors: components});
      if (this._onKeyUp) {
        this._onKeyUp(evt);
      }
      return errors.length === 0;
    },

    /**
      Get the value of the field.

      @method getValue
    */
    getValue: function() {
      if (this.refs.field) {
        if (this.props.multiLine) {
          return this.refs.field.innerText;
        }
        return this.refs.field.value;
      }
    },

    /**
      Set the value of the field.

      @method setValue
      @param {String} newValue The field's new value.
    */
    setValue: function(newValue) {
      if (this.refs.field) {
        if (this.props.multiLine) {
          this.refs.field.innerText = newValue;
        } else {
          this.refs.field.value = newValue;
        }
      }
    },

    /**
      Set the focus on the input.

      @method focus
    */
    focus: function() {
      return this.refs.field.focus();
    },

    /**
      Handle focus events for the input.
      @method _focusHandler
    */
    _focusHandler: function() {
      this.setState({focus: true});
    },

    /**
      Handle keyup event if set in props.
      @param {Object} evt The keyboard event.
    */
    _keyUpHandler: function (evt) {
      if (this.props.onKeyUp) {
        this.props.onKeyUp(evt);
      }
    },

    /**
      Handle blur events for the input.
      @method _blurHandler
    */
    _blurHandler: function(e) {
      this.setState({focus: false});
      this.validate();
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    },

    /**
      Generates a label for the input if the prop is provided.
      @method _generateLabel
    */
    _generateLabel: function() {
      var label = this.props.label;
      var element, id;
      var classes = classNames(
        'generic-input__label', {
          'generic-input__label--focus': this.state.focus,
          'generic-input__label--value-present': !!this.getValue(),
          'generic-input__label--placeholder-present': !!this.props.placeholder
        }
      );
      if (label) {
        id = label.replace(' ', '-');
        element =
          <label className={classes}
            htmlFor={id}>
            {label}
          </label>;
      }
      return {
        labelElement: element,
        id: id
      };
    },

    /**
      Generates a single or multi line input field.
      @method _generateInput
      @param {String} id The element id.
    */
    _generateInput: function(id) {
      const disabled = this.props.disabled;
      const errors = !!this.state.errors;
      if (this.props.multiLine) {
        const classes = classNames(
          'generic-input__multiline-field',
          {'generic-input__multiline-field--disabled': disabled});
        return (
          <div
            className={classes}
            contentEditable={!disabled}
            id={id}
            dangerouslySetInnerHTML={{__html: this.props.value}}
            onChange={this.validate}
            onKeyUp={this._keyUpHandler}
            onFocus={this._focusHandler}
            onBlur={this._blurHandler}
            aria-invalid={errors}
            ref="field">
          </div>);
      }
      return (
        <input className="generic-input__field"
          autoComplete={this.props.autocomplete}
          defaultValue={this.props.value}
          disabled={disabled}
          id={id}
          placeholder={this.props.placeholder}
          required={this.props.required}
          onKeyUp={this._keyUpHandler}
          onFocus={this._focusHandler}
          onBlur={this._blurHandler}
          aria-invalid={errors}
          ref="field"
          type={this.props.type} />);
    },

    render: function() {
      const errors = this.state.errors || this.props.errors;
      var {labelElement, id} = this._generateLabel();
      var classes = classNames(
        'generic-input', {
          'has-error': !!errors
        }
      );
      const errorIcon = errors && this.props.inlineError ?
      (<juju.components.SvgIcon
        name="relation-icon-error"
        size={16}
      />) : undefined;
      return (
        <div className={classes}>
          {labelElement}
          {this._generateInput(id)}
          {errorIcon}
          {errors}
        </div>
      );
    }
  });

}, '0.1.0', { requires: [
  'svg-icon'
]});
