//装配表格中的行数据成html代码
function assembleRow() {
    var isChecked = arguments[0] == null ? "checked" : arguments[0]
    return '<tr style="display: none" id="regexp_item' + arguments[1] + '">'
        + '<td><label class="mdl-switch mdl-js-switch mdl-js-ripple-effect switch_item" for="switch-' + arguments[1] + '">'
        + '<input type="checkbox" id="switch-' + arguments[1] + '" class="mdl-switch__input" ' + isChecked + '>'
        + '</label></td>'
        + '<td style="width:14%;text-align:left"><input style="border-bottom:0" class="mdl-textfield__input" type="text" id="item_name' + arguments[1] + '" readonly></td>'
        + '<td>|</td>'
        + '<td style="width:38%;text-align:left"><input style="border-bottom:0" class="mdl-textfield__input" type="text" id="item_regexp' + arguments[1] + '" readonly></td>'
        + '<td>|</td>'
        + '<td style="width:38%;text-align: left"><input style="border-bottom:0" class="mdl-textfield__input" type="text" id="item_url' + arguments[1] + '" readonly></td>'
        + '<td><button class="mdl-button mdl-js-button mdl-button--icon" id="delete_item' + arguments[1] + '">'
        + '<i class="material-icons">delete</i>'
        + '</button></td>'
        + '</tr>'
}

//保存按钮的点击事件
$("#save_button").click(function () {
    var name = $("#name_input")[0].value
    var regexp = $("#regexp_input")[0].value
    var url = $("#url_input")[0].value
    if (name == "" || regexp == "" || url == "") {
        alert("╮(╯▽╰)╭  please input name , regexp and url ! ")
        return
    }
    chrome.storage.sync.get({'regexp_data': null}, function (result) {
        var data = result.regexp_data
        if (data == null)
            data = []
        var last = data.length
        $("#saved_data_table_body").prepend(assembleRow("checked", last))
        $("#item_name" + last)[0].value = name
        $("#item_regexp" + last)[0].value = regexp
        $("#item_url" + last)[0].value = url
        componentHandler.upgradeElement($("#saved_data_table_body tr:nth-child(1) td label")[0])
        $("#saved_data_table_body tr").first().fadeIn("500")
        data[last] = [name, regexp, url, "checked"]
        chrome.storage.sync.set({'regexp_data': data}, function () {
            //设置成功，恢复输入区样式
            $("#name_input")[0].value = ""
            $("#name_input").parent().removeClass("is-dirty")
            $("#regexp_input")[0].value = ""
            $("#regexp_input").parent().removeClass("is-dirty")
            $("#url_input")[0].value = ""
            $("#url_input").parent().removeClass("is-dirty")
        })
    });

})


//example
var example=[["使用说明", "这里填入正则表达式，地址栏和页面所有的请求都可以去匹配", "重定向的地址", "unchecked"]]

onload = function () {
    chrome.storage.sync.get({'regexp_data': null}, function (result) {
        var data = result.regexp_data
        console.log(data)
        if (data == null||data.length==0)
            data = example
        for (var i = 0; i < data.length; i++) {
            if (data[i] == undefined)
                continue
            $("#saved_data_table_body").prepend(assembleRow(data[i][3], i))
            $("#item_name" + i)[0].value = data[i][0]
            $("#item_regexp" + i)[0].value = data[i][1]
            $("#item_url" + i)[0].value = data[i][2]
            componentHandler.upgradeElement($("#saved_data_table_body tr:nth-child(1) td label")[0])
            $("#saved_data_table_body tr").first().fadeIn("slow")
        }
        //设置删除条目
        //设置每一条表达式独立开关
        for (var i = 0; i < data.length; i++) {
            setSwitchEvent(i)
            setDeleteEvent(i)
        }
    });
}

//每一条表达式独立开关
function setSwitchEvent(i) {
    $("#switch-" + i).click(function () {
        //$("#regexp_item"+i)
        chrome.storage.sync.get({'regexp_data': null}, function (result) {
            var data = result.regexp_data
            if (data == null)
                return
            data[i][3] = $("#switch-" + i)[0].checked == true ? "checked" : "unchecked"
            chrome.storage.sync.set({'regexp_data': data}, function () {

            })
        });
    })
}

//删除条目
function setDeleteEvent(i) {
    $("#delete_item" + i).click(function () {
        var dismissItem = $("#saved_data_table_body").children("#regexp_item" + i)
        dismissItem.fadeOut("500", function () {
            dismissItem.remove()
        })
        chrome.storage.sync.get({'regexp_data': null}, function (result) {
            var data = result.regexp_data
            if (data == null)
                return
            data[i] = undefined
            chrome.storage.sync.set({'regexp_data': data}, function () {

            })
        });
    })
}