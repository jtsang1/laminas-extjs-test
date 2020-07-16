/*
Modified by: Jeremy
Modified on: 2020-07-14
*/
Ext.onReady(function(){
    Ext.QuickTips.init();

    var apiUrl = "http://localhost:8000";

    Ext.namespace('Ext.exampledata');
    Ext.exampledata.priorities = [
        {id: 1, name: 'Low'},
        {id: 2, name: 'Medium'},
        {id: 3, name: 'High'},
    ];

    var priorityRecord = Ext.data.Record.create([ // creates a subclass of Ext.data.Record
        {name: 'id', mapping: 'id'},
        {name: 'name', mapping: 'name'},
    ]);

    var priorityStore = new Ext.data.ArrayStore({
        fields: priorityRecord,
        data: Ext.exampledata.priorities,
        id: 'id'
    });

    initForm();

    function initForm(){
        // turn on validation errors beside the field globally
        Ext.form.Field.prototype.msgTarget = 'side';

        var simple = new Ext.FormPanel({
            labelWidth: 75, // label settings here cascade unless overridden
            frame:true,
            title: 'Add a Todo',
            bodyStyle:'padding:5px 5px 0',
            width: 300,
            defaults: {width: 200},
            defaultType: 'textfield',

            items: [{
                fieldLabel: 'Title',
                name: 'title',
                allowBlank:false,
                value: 'Another todo'
            },
            // new Ext.form.TimeField({
            //     fieldLabel: 'Time',
            //     name: 'time',
            //     minValue: '8:00am',
            //     maxValue: '6:00pm'
            // }),
            new Ext.form.ComboBox({
                fieldLabel: 'Priority',
                store: priorityStore,
                displayField:'name',
                valueField:'id',
                value: 2,
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                emptyText:'Select a priority',
                selectOnFocus:true,
                allowBlank:false,
                name: 'priority_id',
                editable: false,
            })],

            buttons: [{
                text: 'Create',
                handler: function(b){
                    var f = simple.getForm();
                    var vals = f.getFieldValues();
                    //console.log(vals);

                    if(!f.isValid()){
                        f.markInvalid();
                        return;
                    }

                    var btn = this;
                    btn.setDisabled(true);
                    gridPanelMask.show();

                    Ext.Ajax.request({
                        url: apiUrl + '/todo',
                        method: 'POST',
                        success: function(response){
                            var data = JSON.parse(response.responseText);
                            console.log(data);

                            var newRecord = new todoRecord(data, data.id);
                            store.add(newRecord);

                            //console.log(store);

                            btn.setDisabled(false);
                            gridPanelMask.hide();
                        },
                        headers: {},
                        jsonData : vals
                    });
                }
            },{
                text: 'Reset',
                handler: function(b){
                    var f = simple.getForm();
                    f.reset();
                }
            }]
        });

        simple.render('form-example');
    }

    var todoRecord = Ext.data.Record.create([ // creates a subclass of Ext.data.Record
        {name: 'id', mapping: 'id'},
        {name: 'title', mapping: 'title'},
        {name: 'priority_id', mapping: 'priority_id',  type: 'float'},
        {name: 'created_at', mapping: 'created_at', type: 'date', dateFormat: 'Y-m-d H:i:s'}
    ]);

    // create the data store
    var store = new Ext.data.ArrayStore({
        fields: todoRecord,
        id: 'id'
    });

    initGrid();
    var gridPanelMask = new Ext.LoadMask('grid-panel', {msg:"Updating..."});

    loadTodos();

    function initGrid(){
        /**
         * Custom function used for column renderer
         * @param {Number} val
         */
        function priority(val) {

            var p = priorityStore.getById(val);
            var pName = p ? p.get('name') : '';

            if (val === 1) {
                return '<span style="color:green;">' + pName + '</span>';
            } else if (val === 2) {
                return '<span style="color:orange;">' + pName + '</span>';
            } else if (val === 3) {
                return '<span style="color:red;">' + pName + '</span>';
            }
            return val;
        }

        // create the Grid
        var grid = new Ext.grid.GridPanel({
            id: 'grid-panel',
            store: store,
            columns: [
                {
                    header   : 'ID',
                    width    : 75,
                    sortable : true,
                    dataIndex: 'id'
                },
                {
                    id       :'title',
                    header   : 'Title',
                    width    : 160,
                    sortable : true,
                    dataIndex: 'title'
                },
                {
                    header   : 'Priority',
                    width    : 75,
                    sortable : true,
                    renderer : priority,
                    dataIndex: 'priority_id'
                },
                {
                    header   : 'Created At',
                    width    : 120,
                    sortable : true,
                    renderer : Ext.util.Format.dateRenderer('Y-m-d h:iA'),
                    dataIndex: 'created_at'
                },
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [{
                        icon   : '/libs/ext-3.4.1/examples/shared/icons/fam/delete.gif',  // Use a URL in the icon config
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = store.getAt(rowIndex);

                            console.log(this);

                            gridPanelMask.show();
                            //grid.setDisabled(true)

                            Ext.Ajax.request({
                                url: apiUrl + '/todo/delete/' + rec.get('id'),
                                method: 'DELETE',
                                success: function(response){
                                    var data = JSON.parse(response.responseText);
                                    console.log(data);

                                    var newRecord = new todoRecord(data);
                                    store.removeAt(rowIndex);

                                    gridPanelMask.hide();
                                    //grid.setDisabled(false)
                                },
                                headers: {}
                            });
                        }
                    }, {
                        getClass: function(v, meta, rec) {          // Or return a class from a function
                            this.items[1].tooltip = 'Edit';
                            return 'edit-col';
                        },
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = store.getAt(rowIndex);

                            var editTodoForm = editTodoFormPanel.getForm();
                            editTodoForm.setValues(rec.data);
                            editTodoWindow.show();
                        }
                    }]
                }
            ],
            stripeRows: true,
            autoExpandColumn: 'title',
            height: 350,
            width: 600,
            title: 'Todo List',
            // config options for stateful behavior
            stateful: true,
            stateId: 'grid'
        });

        // render the grid to the specified div in the page
        grid.render('grid-example');

        // Init edit form window
        var editTodoFormPanel = new Ext.form.FormPanel({
            labelWidth: 75, // label settings here cascade unless overridden
            frame:true,
            //title: 'Edit todo',
            bodyStyle:'padding:5px 5px 0',
            width: 300,
            defaults: {width: 200},
            defaultType: 'textfield',

            items: [{
                fieldLabel: 'Title',
                name: 'title',
                allowBlank:false,
                value: ''
            }, new Ext.form.ComboBox({
                fieldLabel: 'Priority',
                store: priorityStore,
                displayField:'name',
                valueField:'id',
                value: 2,
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                emptyText:'Select a priority',
                selectOnFocus:true,
                allowBlank:false,
                name: 'priority_id',
                editable: false,
            }), new Ext.form.Hidden({
                name: 'id',
                value: null
            })],
        });

        var editTodoWindow = new Ext.Window({
            title: 'Edit Todo',
            width: 400,
            height:200,
            minWidth: 300,
            minHeight: 200,
            layout: 'fit',
            plain:true,
            bodyStyle:'padding:5px;',
            buttonAlign:'center',
            items: editTodoFormPanel,
            closeAction: 'hide',

            buttons: [{
                text: 'Save',
                handler: function () {

                    var f = editTodoFormPanel.getForm();
                    var vals = f.getFieldValues();

                    if(!f.isValid()){
                        f.markInvalid();
                        return;
                    }

                    var btn = this;
                    btn.setDisabled(true);

                    gridPanelMask.show();

                    Ext.Ajax.request({
                        url: apiUrl + '/todo/edit/' + vals.id,
                        method: 'PUT',
                        success: function(response){
                            var data = JSON.parse(response.responseText);
                            console.log(data);

                            var updatedRecord = store.getById(vals.id);
                            //console.log(updatedRecord);

                            updatedRecord.data = data;
                            updatedRecord.commit();

                            btn.setDisabled(false);
                            editTodoWindow.hide();
                            gridPanelMask.hide();
                        },
                        headers: {},
                        jsonData : vals
                    });
                }
            },{
                text: 'Cancel',
                handler: function () {
                    editTodoWindow.hide();
                }
            }]
        });
    }

    function loadTodos(){
        // sample static data for the store
        /*var myData = [
            [1, '123', 1, '9/1 12:00am'],
            [2, '234', 2, '9/1 12:00am'],
            [3, '345', 3, '9/1 12:00am'],
        ];

        // manually load local data
        store.loadData(myData);*/

        Ext.Ajax.request({
            url: apiUrl + '/todo',
            success: function(response){
                var data = JSON.parse(response.responseText);
                console.log(data);

                store.loadData(data);
            },
            headers: {},
            params: {}
        });
    }
});