<template>
    <h1>New Ticket</h1>
    
    <span class="p-float-label">
        <InputText type="text" v-model="value" />
    <label for="username">Název</label>
    </span>
    <br>
    <br>
    <span class="p-float-label">
       <InputText id="username" type="text" v-model="value" />
        <label for="username">Lokace</label>
    </span>
    <br>
    <br>

    Popis:
    
    <br>
    <Textarea class="p-inputtext-area" auto-resize="true">
        hello
    </Textarea>
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
  .Input{
    display: inline-block;
  }

</style>