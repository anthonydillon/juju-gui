/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

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

var juju = {components: {}}; // eslint-disable-line no-unused-vars

describe('MachineView', function() {

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('machine-view', function() { done(); });
  });

  it('can render', function() {
    var machines = {
      filterByParent: sinon.stub().returns([1, 2, 3])
    };
    var output = jsTestUtils.shallowRender(
      <juju.components.MachineView
        environmentName="My Env"
        machines={machines} />);
    var expected = (
      <div className="machine-view">
        <div className="machine-view__content">
          <div className="machine-view__column">
            <juju.components.MachineViewHeader
              title="New units" />
          </div>
          <div className="machine-view__column">
            <juju.components.MachineViewHeader
              title="My Env (3)" />
          </div>
          <div className="machine-view__column">
            <juju.components.MachineViewHeader
              title="0 containers, 0 units" />
          </div>
        </div>
      </div>);
    assert.deepEqual(output, expected);
  });
});
