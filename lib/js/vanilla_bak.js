
// var tq_ip = 'localhost'
var datatable = new DataTable("#drop_table", {
    ajax: {
        url: "http://" + tq_ip + ":5000/api/dir",
        content: {
            type: "csv",
            headings: true
        }
    }
});


// Select All
var init = function () {
    // check if datatable still remain undefined


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
        heading: '',
        data: []
    };

    // Add a checkbox to each cell
    for (var n = 0; n < this.data.length; n++) {
        file_index = n + "";
        data.data[n] = '<button type="button" id="btn' + file_index
            + '" onclick="download_files()" data-columns="'
            + file_index + '"> Download </button>';
        console.log('data[n]', n);
    }


    // Add the new column
    console.log('> before columns add');
    datatable.columns().add(data);

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


datatable.on("datatable.init", init);

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
            change_list.push(i + 1);
        }
    }
    const ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', 'http://'+tq_ip+':5000/api/change/' + change_list.toString());
    ajaxObj.send();
    ajaxObj.onreadystatechange = function () {
        if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {
            console.log('数据返回成功');
            // console.log(ajaxObj.responseText);

        } else {
            alert('fail to change boolean value');
        }

    };
    // datatable.on('datatable.refresh', function () {
    //     datatable.destroy();
    //     datatable.init(options);
    // });
});

function download_files() {
    var file_index = event.srcElement.dataset.columns;
    // var row_innerText = datatable.rows(0).dt.activeRows[file_index].innerText;
    // var file_name = undefined;
    // if (row_innerText.indexOf('\n') !== -1){
    //     file_name = row_innerText.split('\n')[1];
    // }else if (row_innerText.indexOf('\t') !== -1){
    //     file_name = row_innerText.split('\t')[1];
    // }else {
    //     file_name = row_innerText.split('\t')[1];
    // }
    var drop_counter = 0;
    for (let i in datatable.rows(0).dt.activeRows) {

        if ((parseInt(datatable.rows(0).dt.activeRows[drop_counter].innerText.split('\t')[0]) - 1) === parseInt(file_index)) {
            break
        }
        drop_counter += 1;

    }
    var file_name = datatable.rows(0).dt.activeRows[drop_counter].innerText.split('\t')[1];
    // console.log(drop_counter, file_name);
    // var file_name = datatable.rows(0).dt.activeRows[file_index].innerText.split('\t')[1];
    // var file_name = datatable.rows(0).dt.activeRows[file_index].innerText.split('\t')[1];
    window.location.href = 'http://'+tq_ip+':5000/api/download/'
        + file_name + '.yhld'
}



