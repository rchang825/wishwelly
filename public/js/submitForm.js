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
});



// module.exports = {validate};