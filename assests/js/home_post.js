{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newpostFrom = $('#new-post-form');

        newpostFrom.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newpostFrom.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#post-container>ol').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE::Enable the functionality of the toggle like buttton on the new post
                    new ToggleLike($('.toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }

            })
        });
    }

    // method to create a post in a DOM

    let newPostDom = function (post) {
        // CHANGE::shwo the count of zero  likes on this post
        return $(`<li id="post-${post._id}">
    <p>
    Post:${post.content}
        <small class="user">
            <a class="delete-post-button" href="/posts/delete/${post._id}"><i class="fas fa-trash"></i></a>
        </small>
        <br>
        <small class="name">
            User:${post.user.name}
        </small>
        <br>
        <small>
        <a class="toggle-link-button" data-likes="0"
        href="/likes/toggle/?id=${post._id}&type=Post">
        0 Likes
    </a>
    </small>
    </p>
    <div class="post-comments">
            <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                <input type="text" name="content" placeholder="Type Here Commnets..."
                required>
                <input type="hidden" name="post" value="${post._id}">
                <br>
                <input type="submit" value="Add Comment" class="comment">
            </form>

            <div class="post-comments-list">
                <ol id="post-comments-${post._id}">
                    </ol>
                    
                </div>
            </div>
        </li>`)
    }

    // Delete a post from Dom
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();


            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }


    /* loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method
     on delete link of each, also add AJAX (using the class we've created) to the delete button of each
*/
    let convertPostsToAjax = function () {
        $('#post-container>ol>li').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // geting the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}


