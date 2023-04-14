$(function () {
    console.log("jquery is running");
    $("form#editItem").on("submit", function(e) {
        e.preventDefault();
        console.log("button clicked!");

        //grab text area
        const text = $(this).find("#editName").val();
        const path = $(this).data("update-path");
        console.log("path", path);
        $.ajax({
            type: "POST",
            url: path,
            data: {editName: text},
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    });

    $("img#delete").on("click", function() {
        console.log("delete triggered!");
        const listID = $(this).data("list-to-delete");
        console.log("passed in list ID:", listID);
        $.ajax({
            type: "DELETE",
            url: "/lists/" + listID,
            success: function(response) {
                $("div#list-" + listID).slideUp();
                //$("div#list-" + listID).remove();
                console.log("removed from UI!");
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    });
});



// module.exports = {validate};