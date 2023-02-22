// CHANGE::create a class toggle likes when a like is clicked using AJAx
class ToggleLike {
    constructor(toggleElement) {
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike() {
        $(this.toggler).click((e) => {
            e.preventDefault();
            let self = this

            // this is a new way of writing ajax which you might've studied.it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
                .done((data) => {
                    let likesCount = parseInt($(self).attr('data-likes'));
                    console.log(likesCount);
                    if (data.data.deleted == true) {
                        likesCount -= 1
                    } else {
                        likesCount += 1
                    }

                    $(self).attr('data-likes', likesCount);
                    $(self).html(`${likesCount} Likes`);
                })
                .fail((errData) => {
                    console.log('Error in Completing the request');
                });
        })
    }
}