let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
let pipes = [];
let last_pipe;
let time = 0;
let interval;
let score = 0;
let animating = false;

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && game_state != 'Play'){
        pipes.forEach(pipe => pipe.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        pipes.forEach((pipe) => {
            pipe.left -= move_speed;
            pipe.top = pipe.top;
            pipe.bottom = pipe.top + pipe.height;
            pipe.right = pipe.left + pipe.width;
            pipe.element.style.left = pipe.left + 'px';

            if(pipe.right < 0){
                pipe.element.remove();
            }else{
                if(bird.left < pipe.right && bird.right > pipe.left && (bird.top < pipe.top || bird.bottom > pipe.bottom)){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    clearInterval(interval);
                    return;
                }else if(pipe.increase_score && pipe.right < bird.left){
                    score++;
                    score_val.innerHTML = score;
                    sound_point.play();
                    pipe.increase_score = false;
                }
            }
        });

        if(pipes.length > 0 && pipes[0].right <= background.right / 2){
            create_pipe();
        }

        requestAnimationFrame(move);
    }

    function apply_gravity(){
        if(game_state != 'Play') return;
        bird.dy = bird.dy + gravity;

        if(bird.top <= 0 || bird.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            clearInterval(interval);
            return;
        }

        bird.top += bird.dy;
        bird.bottom = bird.top + bird.height;
        requestAnimationFrame(apply_gravity);
    }

    function create_pipe(){
        let height = 20 + Math.floor(Math.random() * 40);
        let gap = 35;
        let top = Math.floor(Math.random() * (background.height - gap - height));
        let bottom = top + height;
        let pipe = {
            top: top,
            bottom: bottom,
            height: height,
            width: 10,
            left: background.right,
            right: background.right + 10,
            increase_score: true,
            element: document.createElement('div')
        };
        pipe.element.className = 'pipe_sprite';
        pipe.element.style.top = pipe.top + 'px';
        pipe.element.style.left = pipe.left + 'px';
    }