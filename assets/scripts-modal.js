$(document).ready(function() {
	$('#example').DataTable( {
		responsive: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal( {
					header: function ( row ) {
						var data = row.data();
						return 'Details for '+data[0]+' '+data[1];
					}
				} ),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
					tableClass: 'table'
				} ),
				type: 'column',
                target: -1
			}
		},
		columnDefs: [ {
			className: 'control',
			orderable: false,
			targets:   -1
		} ]
	} );
} );