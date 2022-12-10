var config = {
    apiKey: "AIzaSyDD1_h-p3Rn7KiPUH1oVg4SNiXE26r84Ng",
    authDomain: "gcmtest-216909.firebaseapp.com",
    databaseURL: "https://gcmtest-216909.firebaseio.com",
    projectId: "gcmtest-216909",
    storageBucket: "gcmtest-216909.appspot.com",
    messagingSenderId: "947856923993"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.getToken().then(function(currentToken) {
    if(currentToken){
        console.log("");
    }else{
        messaging.requestPermission().then(function () {
         messaging.getToken().then(function (token) {
		//messaging.subscribe('all');
		 var url = window.location.href;
         const path = window.location.pathname;
		 var topic = $('input[name=hidden_topic]').val();
		 var js_id = $('input[name=push_jsid]').val();	
		 var keywords = $('input[name=push_keywords]').val();			
                //console.log("newToken", token);
        $.ajax({
                type: "POST",
                url: "https://www.wisdomjobs.com/url_next.php",
                data: {"url_next":url},
                success: function (resp) {
                }
            }); 
		 $.ajax({
            type: "POST",
            url: "https://push.wisdomjobs.com/restApi/push_api/insert_customer",
            crossDomain: true,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"token":token,"return_url":url,"js_id":js_id,"location":'',"keywords":keywords,'topic':topic}),
            success: function (resp) {
                console.log(resp);
                console.log("done");
                
                //window.location.href="https://www.wisdomjobs.com/manage-push-alerts.php";

                // do something with server response data
            },
            error: function (err) {
                console.log(err);
                // handle your error logic here
            }
        });

            });
        }).catch(function (err) {
            console.log('');
        });
    }
}).catch(function (err) {
    console.log('');
});
