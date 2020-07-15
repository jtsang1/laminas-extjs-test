/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25

Modified by: Jeremy
Modified on: 2020-07-14
*/
Ext.onReady(function(){
    Ext.QuickTips.init();

    // NOTE: This is an example showing simple state management. During development,
    // it is generally best to disable state management as dynamically-generated ids
    // can change across page loads, leading to unpredictable results.  The developer
    // should ensure that stable state ids are set for stateful components in real apps.    
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    // create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
            {name: 'id'},
            {name: 'title',},
            {name: 'priority_id',   type: 'float'},
            {name: 'created_at', type: 'date', dateFormat: 'n/j h:ia'}
        ]
    });

    initGrid();
    loadTodos();

    function initGrid(){
        /**
         * Custom function used for column renderer
         * @param {Number} val
         */
        function priority(val) {
            if (val === 1) {
                return '<span style="color:green;">' + val + '</span>';
            } else if (val === 2) {
                return '<span style="color:orange;">' + val + '</span>';
            } else if (val === 3) {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        }

        // create the Grid
        var grid = new Ext.grid.GridPanel({
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
                    width    : 85,
                    sortable : true,
                    renderer : Ext.util.Format.dateRenderer('m/d/Y'),
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
                            alert("Delete todo: " + rec.get('title'));
                        }
                    }, {
                        getClass: function(v, meta, rec) {          // Or return a class from a function
                            this.items[1].tooltip = 'Save';
                            return 'buy-col';
                        },
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = store.getAt(rowIndex);
                            alert("Save todo: " + rec.get('title'));
                        }
                    }]
                }
            ],
            stripeRows: true,
            autoExpandColumn: 'title',
            height: 350,
            width: 500,
            title: 'Todo List',
            // config options for stateful behavior
            stateful: true,
            stateId: 'grid'
        });

        // render the grid to the specified div in the page
        grid.render('grid-example');
    }


    function loadTodos(){
        // sample static data for the store
        var myData = [
            [1, '123', 1, '9/1 12:00am'],
            [2, '234', 2, '9/1 12:00am'],
            [3, '345', 3, '9/1 12:00am'],
        ];

        // manually load local data
        store.loadData(myData);
    }


});