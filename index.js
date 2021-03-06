//1 open Stream ;
//2 play in stream ; 
const socket = io('https://streaming2207.herokuapp.com/');

$('#div-chat').hide();

// lang nghe danh sach online ;
socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dangky').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li style="color: red;cursor: pointer;margin:20;" id="${peerId}">${ten}</li>`);
    });

    // lang nghe danh sach online moi lang nghe gnuoi dung moi ;
    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li style="color: red;cursor: pointer;" id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });

});

socket.on('DANG_KY_THAT_BAI', () => {
    alert('vui long chon user khac');
});

function openStream() {
    const config = { audio: true, video: true }
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}


// simple , key: 'lwjd5qra8257b9' ;
const peer = new Peer({ key: 'peerjs',host:'mypeer2207.herokuapp.com',secure:true,port:443 });

peer.on('open', id => {
    // lay ra the nao do co id la : my-peer
    // document.getElementById('my-peer').innerHTML = id;
    // signUp 
    $('#btnSignUp').click(function () {
        console.log('register');
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
})

// nguoi call di ;
$('#btnCall').click(function () {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

// nguoi nhan ;
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});


// dynamic click ;
$('#ulUser').on('click', 'li', function () {
    const id = ($(this).attr('id'));
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});