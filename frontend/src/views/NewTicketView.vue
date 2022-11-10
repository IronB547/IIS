<template>
    <h1>New Ticket</h1>
    <div class="container">
        <label for="name">Název</label>
        <InputText class="input" id="name" type="text" v-model="value" />
      <br>
      <br>
        <label for="location">Lokace</label>
        <InputText class="input" id="location" type="text" v-model="value" />
      <br>
      <br>
        <label for="">Popis</label>
        <br>
          <Textarea class="p-inputtext-area" auto-resize="true" v-model="value">
          </Textarea>
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
  .container input, .container textarea{
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .input{
    width: 700px;
    padding-top: 20px;
  }
  .p-inputtext-area{
    width: 700px;
    padding-top: 25px;
  }
</style>