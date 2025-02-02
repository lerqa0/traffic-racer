$(function() {

    let animId;

    const container = $('#container');
    const car = $('#car');
    const car1 = $('#car1');
    const car2 = $('#car2');
    const car3 = $('#car3');
    const line1 = $('#line1');
    const line2 = $('#line2');
    const line3 = $('#line3');
    const restartDiv = $('#restart-div');
    const restartBtn = $('#restart');
    const score = $('#score');
    let highScore = localStorage.getItem('high-score') || 0;
    $('#high-score').text(highScore);

    const containerLeft = parseInt(container.css('left'));
    const containerWidth = parseInt(container.width());
    const containerHeight = parseInt(container.height());
    const carWidth = parseInt(car.width());
    const carHeight = parseInt(car.height());

    let gameOver = false;
    let scoreCounter = 1;
    let speed = 2;
    let lineSpeed = 5;
    let moveRight = false;
    let moveLeft = false;
    let moveUp = false;
    let moveDown = false;

    $(document).on('keydown', function(e) {
        if (!gameOver) {
            switch (e.keyCode) {
                case 37:
                    if (!moveLeft) moveLeft = requestAnimationFrame(left);
                    break;
                case 39:
                    if (!moveRight) moveRight = requestAnimationFrame(right);
                    break;
                case 38:
                    if (!moveUp) moveUp = requestAnimationFrame(up);
                    break;
                case 40:
                    if (!moveDown) moveDown = requestAnimationFrame(down);
                    break;
            }
        }
    });

    $(document).on('keyup', function(e) {
        if (!gameOver) {
            switch (e.keyCode) {
                case 37:
                    cancelAnimationFrame(moveLeft);
                    moveLeft = false;
                    break;
                case 39:
                    cancelAnimationFrame(moveRight);
                    moveRight = false;
                    break;
                case 38:
                    cancelAnimationFrame(moveUp);
                    moveUp = false;
                    break;
                case 40:
                    cancelAnimationFrame(moveDown);
                    moveDown = false;
                    break;
            }
        }
    });

    function left() {
        if (!gameOver && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            moveLeft = requestAnimationFrame(left);
        }
    }

    function right() {
        if (!gameOver && parseInt(car.css('left')) < containerWidth - carWidth) {
            car.css('left', parseInt(car.css('left')) + 5);
            moveRight = requestAnimationFrame(right);
        }
    }

    function up() {
        if (!gameOver && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            moveUp = requestAnimationFrame(up);
        }
    }

    function down() {
        if (!gameOver && parseInt(car.css('top')) < containerHeight - carHeight) {
            car.css('top', parseInt(car.css('top')) + 3);
            moveDown = requestAnimationFrame(down);
        }
    }

    animId = requestAnimationFrame(repeat);

    function repeat() {
        if (collision(car, car1) || collision(car, car2) || collision(car, car3)) {
            stopGame();
            return;
        }

        scoreCounter++;
        if (scoreCounter % 20 === 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (scoreCounter % 500 === 0) {
            speed++;
            lineSpeed++;
        }

        moveCarDown(car1);
        moveCarDown(car2);
        moveCarDown(car3);

        moveLineDown(line1);
        moveLineDown(line2);
        moveLineDown(line3);

        animId = requestAnimationFrame(repeat);
    }

    function moveCarDown(carElement) {
        let carCurrentTop = parseInt(carElement.css('top'));
        if (carCurrentTop > containerHeight) {
            carCurrentTop = -200;
            let carLeft = Math.floor(Math.random() * (containerWidth - carWidth));
            carElement.css('left', carLeft);
        }
        carElement.css('top', carCurrentTop + speed);
    }

    function moveLineDown(lineElement) {
        let lineCurrentTop = parseInt(lineElement.css('top'));
        if (lineCurrentTop > containerHeight) {
            lineCurrentTop = -300;
        }
        lineElement.css('top', lineCurrentTop + lineSpeed);
    }

    restartBtn.click(function() {
        location.reload();
    });

    function stopGame() {
        gameOver = true;
        cancelAnimationFrame(animId);
        cancelAnimationFrame(moveRight);
        cancelAnimationFrame(moveLeft);
        cancelAnimationFrame(moveUp);
        cancelAnimationFrame(moveDown);
        restartDiv.slideDown();
        restartBtn.focus();
        updateHighScore();
    }

    function updateHighScore() {
        if (highScore < parseInt(score.text())) {
            highScore = parseInt(score.text());
            localStorage.setItem('high-score', highScore);
        }
        $('#high-score').text(highScore);
    }

    function collision($div1, $div2) {
        const x1 = $div1.offset().left;
        const y1 = $div1.offset().top;
        const h1 = $div1.outerHeight(true);
        const w1 = $div1.outerWidth(true);
        const b1 = y1 + h1;
        const r1 = x1 + w1;
        const x2 = $div2.offset().left;
        const y2 = $div2.offset().top;
        const h2 = $div2.outerHeight(true);
        const w2 = $div2.outerWidth(true);
        const b2 = y2 + h2;
        const r2 = x2 + w2;

        return !(b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2);
    }
});
