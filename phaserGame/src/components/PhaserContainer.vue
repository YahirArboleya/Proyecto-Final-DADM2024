<template>
    <div id="game">
        <ion-button v-if="showButton" @click="handleClickStart">
            Start Game
        </ion-button>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { IonButton } from '@ionic/vue';
import { Game} from 'phaser';

const showButton = ref(true)

function launch() {
}

function handleClickStart() {
  showButton.value = false;

  launch();
}
</script>

<style scoped>

    #game {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    }

</style>