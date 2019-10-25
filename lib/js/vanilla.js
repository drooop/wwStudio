var datatable = new DataTable("#drop_table", {
    ajax: {
        url: "http://"+tq_ip+":5000/api/get_data/config",
        content: {
            type: "csv",
            headings: true
        }
    }
});


// Select All

var init = function () {
    // console.log('> in datatable init');


    var inputs;
    var btn = document.getElementById("delete-rows");

    var change = function (e) {
        var input = e.target;

        if (input === checkall) {
            for (n = 0; n < inputs.length; n++) {
                inputs[n].checked = input.checked;

                inputs[n].parentNode.parentNode.classList.toggle("selected", input.checked);
            }
        } else {
            input.parentNode.parentNode.classList.toggle("selected", input.checked);
        }

        var checked = [].slice.call(datatable.container.getElementsByTagName('input'));
        var count = false;

        for (n = 0; n < checked.length; n++) {
            if (checked[n].checked) {
                count = true;
                break;
            }
        }

        btn.classList.toggle("invisible", !count);
    };

    // Remove selected rows
    var remove = function (e) {
        var indexes = [];
        var checked = datatable.body.querySelectorAll('input:checked');

        if (checked.length) {
            checked.forEach(function (el, i) {
                indexes[i] = el.parentNode.parentNode.dataIndex;
            });

            // datatable.rows().remove(indexes);

            btn.classList.add("invisible");

            update();
        }
    };

    // Update
    var update = function () {
        checkall.checked = false;
        inputs = [].slice.call(datatable.body.getElementsByClassName("checkbox"));
    };

    // Check all checkbox
    var checkall = document.createElement("input");
    checkall.type = "checkbox";

    var data = {
        sortable: false,
        // heading: checkall,
        heading: '',
        data: []
    };


    // Add a checkbox to each cell
    for (var n = 0; n < this.data.length; n++) {
        // console.log('n: ', n);
        data.data[n] = '<input type="checkbox" class="checkbox">';
    }
    // console.log('this.data: ', this.data);


    // Add the new column
    // console.log('> before columns add');
    datatable.columns().add(data);
    // console.log('> after columns add');

    update();

    // Remove button
    btn.addEventListener("click", remove);

    // Checkboxes
    datatable.container.addEventListener("change", change);

    // Update
    datatable.on("datatable.page", update);
    datatable.on("datatable.perpage", update);
    datatable.on("datatable.sort", update);
};

// console.log('> before datatable.init');
datatable.on("datatable.init", init);
// console.log('> after datatable.init');

$("#sidebar_1>a").on('click', function (e) {
    if ($(this).hasClass('active')) {
        // $(this).removeClass('active');
    } else {
        $("#sidebar_1>a").removeClass('active');
        $(this).addClass('active');
    }
});

$("#delete-rows").on('click', function (e) {
    var all_rows = datatable.rows(0).dt.activeRows;
    var change_list = [];
    for (let i = 0; i < all_rows.length; i++) {
        if ($(all_rows[i]).hasClass('selected')) {
            var var_num = datatable.rows(0).dt.activeRows[i].cells[0].data;
            // console.log(var_num);
            change_list.push(var_num);
        }
    }
    const ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', 'http://'+tq_ip+':5000/api/change/' + change_list.toString());
    ajaxObj.send();
    ajaxObj.onreadystatechange = function () {
        if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {
            console.log('数据返回成功');
            console.log(ajaxObj.responseText);
            window.location.reload();
        }
    };

    // datatable.on('datatable.refresh', function () {
    //     datatable.destroy();
    //     datatable.init(options);
    // });
});
