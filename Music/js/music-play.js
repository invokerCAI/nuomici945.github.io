$(document).ready(function() {
	var play = $('.music-type a');
	var wholeIndex = $('body');
	var mouse = $('.display-mouse');
	var musicBar = $('.music-bar');
	
	var obj = {//在线音乐数据
		name: ['fire-2NE1', '银の龙の背に乗って', '暖暖-梁静茹', 'Officially Missing You-Tamia', '孤独患者-陈奕迅'],
		url: ['http://14.215.93.19/m10.music.126.net/20170615185735/1fea4a6b2e1ab3569a2676a69501265b/ymusic/d5e1/bf7d/9570/0010281aa17562de704214d10f35d455.mp3?wshc_tag=0&wsts_tag=59426243&wsid_tag=716d2be5&wsiphost=ipdbm','http://14.215.231.155/m10.music.126.net/20170616110148/a8db1f6cbb1a987b958e0d7a6826eab5/ymusic/9fb2/48b2/be4c/de12a7464fcb38b9ccef8930bd0e4066.mp3?wshc_tag=0&wsts_tag=59434440&wsid_tag=716d2af9&wsiphost=ipdbm','http://14.215.93.25/m10.music.126.net/20170616110216/ece803f42f65aa63681741d4c7bb5371/ymusic/101f/02d0/4c23/d95247a7de901df7b22f33564bd5d5f9.mp3?wshc_tag=0&wsts_tag=5943445c&wsid_tag=716d2af9&wsiphost=ipdbm','http://14.215.231.155/m10.music.126.net/20170616110239/857e832b3343ce6f842a7a3568ec3f38/ymusic/0600/9985/aced/5050b7cca4b8f972d96e7daeb7741323.mp3?wshc_tag=0&wsts_tag=59434473&wsid_tag=716d2af9&wsiphost=ipdbm','http://14.215.93.23/m10.music.126.net/20170616110325/5b3bf180b17926f5986a639bb698557c/ymusic/9564/3bb4/be78/69511d4a81bf11f86343027f32a8e7cc.mp3?wshc_tag=0&wsts_tag=594344a1&wsid_tag=716d2af9&wsiphost=ipdbm']
	}
    var index = null;
	var musicTime = $('.music-time');
	var nowTimeBox = $('.current-time');
	var musciName = $('.musicN');
	var time = null;
	var timer = null;
	var audio = null;
	var audioCurrent = null;
	var audioDuration = null;
	play.on('click', function() {
		index = $(this).index();
		if($('.audio')) {
			$('.audio').remove();

		}
		getTime() 
		initAudio(index);
	})
	drap(mouse);//拖拽调用

	function drap(obj) {//拖拽进度条
		obj.on('mousedown', function(ev) {
			var parent = obj.parent().innerWidth();
			var x = ev.pageX - obj.position().left;
			ev.preventDefault()//阻止浏览器默认行为
			clearInterval(time);
			var mouseX = null;
			if(audio!=null){
				audioCurrent = audio.currentTime;
				$(document).on('mousemove', function(ev) {
				mouseX = ev.pageX - x;
				if(mouseX < 0) {
					mouseX = 0;
				}
				if(mouseX >= parent) {
					mouseX = parent;
				}

				obj.css({
					'left': mouseX + 'px',

				});
				musicTime.html()
				musicBar.css('width', mouseX + 'px');
				musicBar.css('transition', 'none');

				nowTimeBox.html(getSpeedTime(mouseX, parent));//获取拖拽时的音乐时间
				
				ev.preventDefault()//阻止浏览器默认行为
			

			});
			$(document).on('mouseup', function() {
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
				var time = (mouseX / parent) * audio.duration;
				audio.currentTime = time;
				getTime()
			})
			}
			
			
		})
	}

	
	function getSpeedTime(mouseX, parent) {//快进的时间获取
		var time = (mouseX / parent) * audio.duration;
		time = Math.floor(parseInt(time))
		var ss = time % 60;
		var m = Math.floor(time / 60);
		var str = '';
		if(ss < 10) {
			str = m + ":" + "0" + ss;
		}
		if(ss >= 10) {

			str = m + ":" + ss;
		}
		return str
	}
	var autoPlay = $('.play'); //播放按钮
	autoPlay.on('click', function() { //播放按钮暂停按钮
		if(audio != null) {
			if(autoPlay.hasClass('icon-play')) {

				audio.play();
				autoPlay.removeClass('icon-play').addClass('icon-pause');

			} else {
				audio.pause();
				autoPlay.removeClass('icon-pause').addClass('icon-play');

			}
		}
	})

	var initAudio = function() { //创建一个mp3媒体；
		clearInterval(time); //清楚定时器
		musciName.html();
		audio = new Audio();
		audio.className = 'audio';
		audio.src = obj.url[index]
		wholeIndex.append(audio);
		totalTime(audio)
		audio.play();
		autoPlay.removeClass('icon-play').addClass('icon-pause');
		musciName.html(obj.name[index])
		getTime(audio);

	}

	function getTime() { //获取媒体的时间以设置进度条长度；
		time = setInterval(function() {
			speedMusic()

		}, 1000);
	}

	function speedMusic() {//控制进度条
		audioCurrent = audio.currentTime;
		var time = Math.floor(parseInt(audioCurrent))

		var ss = time % 60;
		var m = Math.floor(time / 60);
		var str = '';
		if(ss < 10) {
			str = m + ":" + "0" + ss;
		}
		if(ss >= 10) {

			str = m + ":" + ss;
		}
		musicBar.css('width', (audioCurrent / audio.duration) * 100 + '%');
		musicBar.css('transition', 'width .6s ease;');
		mouse.css('left', (audioCurrent / audio.duration) * 100 + '%');
		nowTimeBox.html(str);
	}

	function totalTime() {//获取音乐总时长
		clearInterval(timer);
		timer = setInterval(function() {
			var second = audio.duration / 60;
			second = second.toFixed(2);
			var str = second.toString();
			var strTotal = '';
			str.split('.');
			arr = str[2] + str[3]
			if(audio.duration != NaN) {

				if(parseInt(arr) < 10) {
					strTotal = str[0] + ':' + "0" + str[3];
				}
				if(parseInt(arr) >= 10) {
					strTotal = str[0] + ':' + str[2] + str[3];
				}
				if(parseInt(arr) > 60) {
					strTotal = (parseInt(str[0]) + 1) + ':' + (parseInt(arr) - 60);
				}
				musicTime.html(strTotal);
			}

		}, 30)
	}
	//控制音乐声音
	var vCBtn = $('.volume-control');
	var icon =  $('.volume-content p');
	var musicCir =$('.volume-cir')
    var mute = $('.volume')
		volumeControl()

	function volumeControl(){
		vCBtn.on('mousedown',function(ev){
			var x =ev.pageX-icon.width();
			ev.preventDefault()//阻止浏览器默认行为
			$(document).on('mousemove',function(ev){
				var length=ev.pageX-x
				if(length>=90){
					length =90
				}
				if(length<=0){
					length=0;
					mute.removeClass('icon-volume-down').addClass('icon-volume-off')
				}
				if(length>0){
					mute.removeClass('icon-volume-off').addClass('icon-volume-down')
				}
				if(audio!=null){
					audio.volume = length/icon.parent().width()
				}
//				console.log(length/icon.parent().width())

				icon.css('width',length+'px');
				ev.preventDefault()//阻止浏览器默认行为
			})
			$(document).on('mouseup',function(){
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			})
			
		})
	}
	//切换歌曲
	var next = $('.forward'); //下一首
	var prev = $('.backward'); //上一首
     next.on('click',function(){
     	if(audio!=null){
     		index++;
     		if(index>4){
     			index=4
     		}
     		initAudio()
     	}
     	
     })
      prev.on('click',function(){
     	if(audio!=null){
     		index--;
     		if(index<0){
     		     index=0
     		}
     		initAudio()
     	}
     	
     })
})