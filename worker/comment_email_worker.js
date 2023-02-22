const queue=require('../config/kue');

const commentmailer=require('../mailers/comments_mailers');

queue.process('emails',(job,done)=>{
    console.log('emails worker is processing a job',job.data);

    commentmailer.newComment(job.data)

    done();
})