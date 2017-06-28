$(document).ready(function(){
    var dataTable = $('#list').DataTable({
        info: false,
        paging: false,
        ordering: false,
        searching: false,
        responsive: true,
        scrollY: "160px",
        "language": {
            "emptyTable": "Can't find any place :( Try to change radius"
        }
    });

    var $currentRadius = $('#current');
    var $radius = $('#radius');
    var $category = $('input[name=category]');

    $radius.on('input', function () {
        $currentRadius.text($(this).val());
    });
    $currentRadius.text($radius.val());

    $radius.on('change', function () {
        requestApi();
    });
    $category.on('change', function () {
        requestApi();
    });
    requestApi();

    function requestApi() {
        var params = $.param({
            categoryId: $category.filter(':checked').val(),
            radius: $radius.val(),
            client_id: '2TC0GHMY3FTKAY5Y3WSXWTYUT3EY0CL11DOTPSD5BELKYDVU',
            client_secret: 'ISIT3PFVCZORCQA0J3YGFOJOQ1C3GUZPUDFUKL3LKGRR4O5N',
            v: getDateVersion(),
            ll: '48.168088,17.138037'
        });

        $.get('https://api.foursquare.com/v2/venues/search', params, function (response) {
            if (response.meta.code !== 200) {
                alert('Cannot perform request');
                return;
            }

            var dataToDisplay = [];
            var venues = response.response.venues;
            for (var i in venues) {
                if (!venues.hasOwnProperty(i)) {
                    continue;
                }
                var venue = venues[i];

                dataToDisplay.push([
                    '<p>' + venue.name + '</p>',
                    '<p>' + pickMainCategory(venue.categories) + '</p>',
                    '<p>' + venue.location.formattedAddress.join(', ') + '</p>',
                    '<p>' + venue.location.distance + '</p>',
                ]);
            }

            dataTable.clear().rows.add(dataToDisplay).draw();
        }, 'json');
    }

    function pickMainCategory(categories) {
        for (var i in categories) {
            if (!categories.hasOwnProperty(i)) {
                continue;
            }

            if (categories[i].primary) {
                return categories[i].name;
            }
        }
    }

    function getDateVersion() {
        var date = new Date();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
        ].join('');
    }
});
