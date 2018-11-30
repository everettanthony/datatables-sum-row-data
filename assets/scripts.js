$(document).ready(function() {
    var table = $('#example').DataTable( {
        dom: 'Bfrtip',
        select: true,
        pageLength: 20,
        fixedHeader: true,
        columnDefs: [
            {
                render: function ( data, type, row ) {
                    var dataClean = data.replace(/&nbsp;/g, '');
                    var val = $.fn.dataTable.render.number(',').display( dataClean );
                    return val;
                },
                targets: 12
            },
            {
                render: function ( data, type, row ) {
                    var dataClean = data.replace(/&nbsp;/g, '');
                    var val = $.fn.dataTable.render.number(',', '.', 2, '$').display( dataClean );
                    return val;
                },
                targets: 14
            }
        ],
        buttons: [
             {
                text: 'Select current',
                action: function () {
                    table.rows( { page:'current' } ).select();
                }
            },       
            {
                text: 'Select all',
                action: function () {
                    table.rows().select();
                    console.log(table.rows('.selected').data().length + ' row(s) selected');
                }
            },
            {
                text: 'Select none',
                action: function () {
                    table.rows().deselect();
                }
            }
        ],
        order: [3, 'asc'],
        rowGroup: {
            endRender: function ( rows, group ) {
                var complaints = rows
                    .data()
                    .pluck(12)
                    .reduce( function (a, b) {                       
                      //  var bNum = parseFloat(b.replace(/&nbsp;/g, ''));
                        return a + parseFloat(b.replace(/&nbsp;/g, ''));
                    }, 0);
                complaintsTotal = $.fn.dataTable.render.number(',').display( complaints );

                var credits = rows
                    .data()
                    .pluck(14)
                    .reduce( function (a, b) {                       
                      //  var bNum = parseFloat(b.replace(/&nbsp;/g, ''));
                        return a + parseFloat(b.replace(/&nbsp;/g, ''));
                    }, 0);
                creditsTotal = $.fn.dataTable.render.number(',', '.', 2, '$').display( credits );
                
                return $('<tr class="dtrg-group dtrg-end" />')
                    .append( '<td class="row-totals" colspan="12">TOTAL</td>' )
                    .append( '<td class="sum-totals complaint-totals" colspan="2">'+complaintsTotal+'</td>' )
                    .append( '<td class="sum-totals credit-totals" colspan="3">'+creditsTotal+'</td>' );

            },
            dataSrc: 3
        },
        drawCallback: function ( settings ) {
            let fltrDisplay = $('.group-select-display').val();
            displayGroup(fltrDisplay);
        }
    } );

    function displayGroup(val) {
         switch (val) {
          case 'FY':
            console.log('Fiscal Year');
            break;
          case 'CY':
            console.log('Current Year');
            break;
          case 'M':
            console.log('Month');
            break;
          default:
            console.log('Where is the display filter?');
        }
    }

    table.on( 'rowgroup-datasrc', function ( e, dt, val ) {
        table.order.fixed( {pre: [[ val, 'asc' ]]} ).draw();
    } );

    $('.group-select').on( 'change', function (e) {
        e.preventDefault();
        table.rowGroup().dataSrc( this.value );
        displayFormat(table, $('.group-select-display').val());
    } );

    $('.group-select-sub').on( 'change', function (e) {
        e.preventDefault();
        console.log( $(this).val() );
        $(tableRows).each( function () {
            groupName = this.cells[2].innerHTML;
        });
    } );

    $('.group-select-display').on( 'change', function (e) {
        displayFormat(table, this.value);
    } );

    function displayFormat(tbl, fltr) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        let dates = tbl.rows()
            .data()
            .pluck(1);
        let filtered = [];
        let dateFilter = fltr;

        if (dateFilter) {
            dateFilter = dateFilter.toLowerCase();

            dates.filter((e) => {
                let [m, d, y] = e.split('/');   
                let month = parseInt(m, 10);
                let day = parseInt(d, 10);
                let year = parseInt(y, 10);
                let fiscalyear = '';
                let today = new Date();
                let lastYear = today.getFullYear() - 1;
                let nextYear = today.getFullYear() + 1;
                let currentYear = today.getFullYear();

                if (dateFilter === 'fy') {
                    if ((today.getMonth() + 1) <= 9) {
                        filtered.push(month + '/' + day + '/' + lastYear);
                        filtered.push(month + '/' + day + '/' + currentYear);
                    } else {
                        filtered.push(month + '/' + day + '/' + currentYear);
                        filtered.push(month + '/' + day + '/' + nextYear);
                    }
                } 
                else if (dateFilter === 'cy' && (currentYear === year)) {
                    filtered.push(month + '/' + day + '/' + year);
                } 
                else if (dateFilter === 'm') {
                    filtered.push(month);
                }
            });
        }
        else {
            tbl.columns.adjust().draw(); 
        }

        tbl.column( 1 ).search(filtered.join('|'), true, true).draw();

        hideColumns(tbl, dateFilter);
    }

    function hideColumns(tbl, fltr) {
        if (fltr === 'm') {
            tbl.columns( [ 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16 ] ).visible( false, false );
            tbl.columns.adjust().draw( false ); 
            $('.dtrg-start td').attr('colspan', 4);
            $('.dtrg-end td.row-totals').attr('colspan', 2);
            $('.dtrg-end td.sum-totals').attr('colspan', 1);
        }
        else {
            tbl.columns().visible( true );
            $('.dtrg-start td').attr('colspan', 17);
            $('.dtrg-end td.row-totals').attr('colspan', 12);
            $('.dtrg-end td.complaint-totals').attr('colspan', 2);
            $('.dtrg-end td.credit-totals').attr('colspan', 3);
        }
    }
  
} );