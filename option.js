//装配表格中的行数据成html代码
function assembleRow() {
    return '<tr style="display: none">'
        + '<td><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">'
        + '<input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>'
        + '</label></td>'
        + '<td style="width:10%;text-align:left">' + arguments[0] + '</td>'
        + '<td>|</td>'
        + '<td style="width:40%;text-align:left">' + arguments[1] + '</td>'
        + '<td>|</td>'
        + '<td style="width:40%;text-align: left">' + arguments[3] + '</td>'
        + '<td><button class="mdl-button mdl-js-button mdl-button--icon">'
        + '<i class="material-icons">delete</i>'
        + '</button></td>'
        + '</tr>'
}

//保存按钮的点击事件
$("#save_button").click(function () {
    $("#saved_data_table_body").prepend(assembleRow(
        $("#name_input").val()
        , $("#regexp_input").val()
        , $("#url_input").val()))
    $("#saved_data_table1").slideDown("slow")
    //$("#saved_data_table_body tr").first().fadeIn("slow")
    //$("#saved_data_table1").slideUp()
})