YUI.add('juju-view-unit', function(Y) {

var views = Y.namespace('juju.views'),
    models = Y.namespace("juju.models"),
    Templates = views.Templates;

UnitView = Y.Base.create('UnitView', Y.View, [], {
    initializer: function () {
        console.log('view.init.unit', this.get('unit'));
    },

    template: Templates['unit'],

    render: function () {
        var container = this.get('container');
        console.log('view.render.unit');
        if (!this.get('unit')) {
            // XXX I am assuming that once the unit data is ready all other
            // data is as well.
            // XXX put loading message back
            container.setHTML('<div class="alert">Loading...</div>');
            console.log('waiting on data');
            return this;
        };

        var db = this.get('db'),
            unit = this.get('unit').getAttrs(),
            service = db.services.getById(unit.service).getAttrs(),
            machine = db.machines.getById(unit.machine).getAttrs();

        // XXX Why do I have to do this?  Is there a better way?
        if (!db.charms.getById(service.charm)) {
            charm = new models.Charm({id: service.charm});
            db.charms.add(charm);
        }
        var charm = db.charms.getById(service.charm).getAttrs();

        console.log('unit', unit);
        console.log('charm', charm);
        console.log('service', service);
        UnitView.superclass.render.apply(this, arguments);

        container.setHTML(this.template(
            {'unit': unit,
             'service': service,
             'machine': machine}));
        return this;
    }
});


views.unit = UnitView;

}, '0.1.0', {
    requires: [
        'base',
        'handlebars',
        'node',
        'view']

});
