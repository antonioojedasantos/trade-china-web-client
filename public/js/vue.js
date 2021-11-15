var app = new Vue({
    el: '#app',
    data: {
      datos:[],  
      mensaje: ''
    },
    methods:{
        getDatos(){
            let url = '/api/datosp';
            axios.get(url).then(response=>{
                console.log(response.data);
                this.datos=response.data;
            });
        },
        NuevoDato(){
            console.log('Nuevo Dato antonio');

            Swal.mixin({
              
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2', '3', '4']
              }).queue([
                {
                    title: 'Digita tu nombre',
                    text:  'Nombre ',
                    input: 'text',
                    inputValidator: (value) => {
                        if (!value) {
                          toastr.error('Debes digitar un nombre','Error');  
                          return ' '
                        }
                      }
                },
                {
                  title: 'Digita tu apellido',
                  text:  'Apellido ',
                  input: 'text',
                  inputValidator: (value) => {
                      if (!value) {
                        toastr.error('Debes digitar un apellido','Error');  
                        return ' '
                      }
                    }
              },{
                title: 'Digita tu telefóno',
                text:  'Telefono ',
                input: 'text',
                inputValidator: (value) => {
                    if (!value) {
                      toastr.error('Debes digitar un numero telefonico','Error');  
                      return ' '
                    }
                  }
            },
            {
              title: 'Digita tu Correo electronico',
              text:  'Email ',
              input: 'text',
              inputValidator: (value) => {
                  if (!value) {
                    toastr.error('Debes digitar un email','Error');  
                    return ' '
                  }
                }
          },
                
              ]).then( async  (result) => {
                if (result.value) {
                  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
                  var contraseña = "";
                  for (i=0; i<20; i++) contraseña +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
                  console.log(contraseña)
                  datos= {
                      nombre   : result.value[0],
                      apellido : result.value[1],
                      telefono  : result.value[2],
                      email : result.value[3],
                      code : contraseña,
                
                  }   
                  //console.log(datos);

                 let url = '/api/datosp';
                 await axios.post(url, datos).then(response=>{
                    console.log(response.data);
                    this.mensaje=response.data;
                 });

                 this.getDatos();                  
                 toastr.success(this.mensaje);
                }
              })








        },
        EliminarDato(dato){
            console.log(dato);


            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
              })
              
              swalWithBootstrapButtons.fire({
                title: '¿Estas Seguro?',
                html: "Si eliminas el registro de <strong>"+ dato.nombre +"</strong>, <br>¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar!',
                cancelButtonText: 'Cancelar!',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                reverseButtons: true
              }).then( async (result) => {
                if (result.value) {


                let url = '/api/datosp/'+dato.id;
                await axios.delete(url).then(response=>{
                    console.log(response.data);
                    this.mensaje=response.data;
                });

                this.getDatos();                  
                toastr.success(this.mensaje);


                } else if (
                  /* Read more about handling dismissals below */
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                    toastr.error('Acción Cancelada!');  
                }
              })






        },

        EditarDato(dato){
            console.log(dato);



            formulario = 
            '<div id="swal2-content" class="swal2-html-container" style="display: block;">Nombre y apellido</div>'+
            '<input id="nombre" name="nombre" class="swal2-input" placeholder="" type="text" style="display: flex;">'+

            '<div id="swal2-content" class="swal2-html-container" style="display: block;">Posicion de este empleado</div>'+
            '<select id="posicion" name="posicion" class="swal2-select" style="display: flex;"><option value="" disabled="">Selecciona una posicion</option><option value="Auditor">Auditor</option><option value="Soporte">Soporte</option><option value="Seguridad">Seguridad</option></select>'+

            '<div id="swal2-content" class="swal2-html-container" style="display: block;">Salario</div>'+
            '<input id="salario" name="salario" min="4" step="0.01" class="swal2-input" placeholder="" type="number" style="display: flex;">';




              Swal.fire({
                title: 'Editar Registro',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Guardar',
                html: formulario,
                focusConfirm: false,
                preConfirm: async () => {


                    ultimosdatoseditados = {
                        nombre:    document.getElementById('nombre').value,                          posicion:  document.getElementById('posicion').value, 
                        salario:   document.getElementById('salario').value,            
                    };

                    let url = '/api/datosp/'+dato.id;
                    await axios.put(url, ultimosdatoseditados).then(response=>{
                        console.log(response.data);
                        this.mensaje=response.data;
                    });

                    this.getDatos();                  
                   

                  return toastr.success(this.mensaje);
                }
              })


              document.getElementById('nombre').value    = dato.nombre;
              document.getElementById('posicion').value  = dato.posicion;
              document.getElementById('salario').value   = dato.salario;
              
             
        }

    },
    mounted(){
         this.getDatos();   
    }

})