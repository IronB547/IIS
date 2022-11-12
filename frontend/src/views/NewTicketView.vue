<template>
    <h1>Nový Ticket</h1>
    <div class="grid">
      <div class="text-container">
        <label class="labels" for="name">Název</label>
        <br>
          <InputText class="input" id="name" type="text" v-model="value" />
        <br>
          <label class="labels" for="location">Lokace</label>
        <br>
          <InputText class="input" id="location" type="text" v-model="value" />
        <br>
          <label class="labels" for="description">Popis</label>
        <br>
          <Textarea class="p-inputtext-area" auto-resize="true" v-model="value">
          </Textarea>

        </div>
          <div class ="photo-container">
            <label class="labels" for="description">Foto</label>
            <br>
            <InputText class="input" id="location" type="text" v-model="value" />
        </div>
    </div>    
</template>
    
  <script>
    // @ is an alias to /src
    import Textarea from 'primevue/textarea';
    import InputText from 'primevue/inputtext';
    
    export default {
      name: "NewTicketView",
      components: {
        Textarea,
        InputText
      },
    };
  </script>

<style scoped lang="scss">
  .input{
    margin-bottom: 25px;
    margin-top: 5px;
    width: 100%;
  }
  .grid{
    display: grid;
    grid-template: "left right";
    gap: 200px;
    align-items: center;
    margin: 100px 100px 0px 100px;
  }
  .text-container{
    grid-area: left;
  }
  .photo-container{
    grid-area: right;
  }
  .labels{
    float: left;
    
  }
  .p-inputtext-area{
    margin-top: 5px;
    width: 100%;
  }
</style>