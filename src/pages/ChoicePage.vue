<template>
    <div class="body">
        <div @click="test()" class="main" data-text="普通教师" style="--c:#1e90ff"></div>
        <div class="main" data-text="系主任" style="--c:#ff4757"></div>
        <div class="main" data-text="学院管理员" style="--c:#ffa502"></div>
    </div>
</template>

<script>
export default {
    name: "ChoicePage",
    methods: {
        test() {
            console.log("hello");
        }
    },
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.body {
    background: rgb(29, 67, 89);
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

.main {
    position: relative;
    width: 200px;
    height: 80px;
    background: black;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 5px;
    transition: 1s linear;
}

.main::before {
    content: "";
    width: 300px;
    height: 60px;
    background: var(--c);
    position: absolute;
    animation: roll 4s linear infinite;
    filter: blur(5px);
    transition: 1s linear;
}

.main::after {
    width: 195px;
    height: 75px;
    content: attr(data-text);
    position: absolute;
    color: var(--c);
    font-size: 25px;
    text-align: center;
    line-height: 75px;
    background: #333;
    text-transform: uppercase;
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 5px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: 1s linear;
}

@keyframes roll {
    100% {
        transform: rotate(360deg);
        filter: blur(5px) hue-rotate(360deg);
    }
}

.main:hover {
    box-shadow: 0 0 5px var(--c), 0 0 10px var(--c), 0 0 20px var(--c);
    background: var(--c);
}

.main:hover::before {
    height: 500px;
    width: 500px;
    animation-play-state: paused;
    filter: hue-rotate(0);
}

.main:hover::after {
    background: var(--c);
    color: white;
}
</style>
