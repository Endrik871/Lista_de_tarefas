


const modal = document.querySelector(".editar-modal-container");
const carregando = document.querySelector(".carregando");


const tarefas = document.querySelectorAll(".tarefa")

const inputPesquisar = document.querySelector('.input-pesquisa');
const pesquisar = document.querySelector(".pesquisar");

const containerTarefas = document.querySelector(".container-tarefas");



(function () {

    mostrarTodasTarefas();
    pesquisarTarefasUser();

    inputPesquisar.addEventListener("blur", (e) => {

        if (inputPesquisar.value === "") {
            mostrarTodasTarefas()
        }
    })


})();

document.querySelector(".adicionar").onclick = () => {
    adicionarNovaTarefa()
}

async function adicionarNovaTarefa() {
    const carregandoNova = document.querySelector(".carregando-nova");
    const textBotaoAdd = document.querySelector(".texto-add");



    carregandoNova.style.display = "block"
    textBotaoAdd.style.display = "none"

    const title = document.querySelector("#titulo").value
    const descricao = document.querySelector("#descricao").value 
    if(!descricao){
        descricao.value = "Sem descrição";
    }
    if (!title) {
        alert("coloque os dados da tarefa")
        carregandoNova.style.display = "none"
        document.querySelector(".texto-add").style.display = "block"
    } else {
        const request = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: 201,
                userId: 11,
                title: title,
                completed: false
            })
        });
        const resposta = await request.json();

        if (!request.ok) {
            console.log("Erro ao criar nova tarefa");
        } else {



            containerTarefas.insertAdjacentHTML('afterbegin',
                `<div class="tarefa nova-tarefa" >
                <div style="display: flex; align-items: center;">
                <div class="dadosTodo">
                <p class="userId">Usuário: ${11}</p>
                 <h2 class="titulo-tarefa">${title}</h2>
                 <p class="descricao">${descricao}</p>
                 </div>
                 </div>
                 <div style="display: flex;">
                 <button class="completa"><img src="./imgs/icons8-check-30.png" alt="Completar"></button>
                <button class="editar"><img src="./imgs/icons8-edit-50.png" alt="Editar"></button>
                <button class="deletar"><img src="./imgs/icons8-trash-50.png" alt="Deletar"></button>
            </div>
        </div>`);


            const novaTarefa = document.querySelector('.nova-tarefa');

            novaTarefa.querySelector('.editar').onclick = () => {
                const dados = {
                    id: resposta.id,
                    userId: resposta.userId,
                    completed: resposta.completed,
                    title: title,
                    descricao: descricao
                }
                mostrarModalEditar(dados, document.querySelector(".tarefa"))
            }

            novaTarefa.querySelectorAll(".deletar").forEach((item, index) => {

                item.onclick = () => {
                    deletarTarefa(resposta.id);

                    novaTarefa.remove();
                }
            })

            novaTarefa.querySelector('.completa').onclick = () => {
                let completa = !resposta.completed;
                
                completarTarefa(resposta.id, completa);
                resposta.completed = completa;

                const pai = novaTarefa;
                if (completa) {
                    pai.querySelector('.titulo-tarefa').style.textDecoration = "line-through";
                    pai.querySelectorAll("p").forEach(item => item.style.textDecoration = "line-through");
                } else {
                    pai.querySelector('h2').style.textDecoration = "none";
                    pai.querySelectorAll("p").forEach(item => item.style.textDecoration = "none");
                }

            }

            carregandoNova.style.display = "none"
            document.querySelector(".texto-add").style.display = "block"

        }



    }
}


async function mostrarTodasTarefas() {

    carregando.style.display = "block";

    if (containerTarefas) {
        containerTarefas.style.display = "none";
    }

    const request = await fetch('https://jsonplaceholder.typicode.com/todos')
    if (!request.ok) {
        console.log("Erro na requisição");
    } else {

        const resposta = await request.json();

        carregando.style.display = "none";
        containerTarefas.style.display = "block";

        containerTarefas.innerHTML = "";

        for (let item of resposta) {



            containerTarefas.innerHTML +=

                `<div class="tarefa" >
                        <div  style="display: flex; align-items: center;">
                        <div class="dadosTodo">
                        <p class="userId">Usuário: ${item.userId}</p>
                            <h2>${item.title}</h2>
                            <p class="descricao">Sem descrição</p>
                            </div>
                            </div>
                            <div style="display: flex;">
                            <button class="completa"><img src="./imgs/icons8-check-30.png" alt=""></button>
                        <button class="editar" ><img src="./imgs/icons8-edit-50.png" alt=""></button>
                        <button class="deletar" ><img src="./imgs/icons8-trash-50.png" alt=""></button>
                        </div>
                    </div>`


        }






        document.querySelectorAll(".tarefa").forEach((item, index) => {

            if (resposta[index].completed) {

                item.querySelector('h2').style.textDecoration = "line-through";
                item.querySelector("p").style.textDecoration = "line-through";
            } else {
                item.querySelector('h2').style.textDecoration = "none";
                item.querySelector("p").style.textDecoration = "none";
            }
        })


        document.querySelectorAll(".editar").forEach((item, index) => {

            item.onclick = () => {
                const divPai = item.parentElement.parentElement;
                const dados = {
                    id: resposta[index].id,
                    userId: resposta[index].userId,
                    completed: resposta[index].completed,
                    title: divPai.querySelector("h2").innerText,
                    descricao: divPai.querySelector(".descricao").innerText // achei
                }
            
                mostrarModalEditar(dados, divPai);
            }
        })

        document.querySelectorAll(".deletar").forEach((item, index) => {
            item.onclick = () => {
                deletarTarefa(resposta[index].id);
                const divPai = item.parentElement.parentElement;
                divPai.remove();
            }
        });

        
        
        document.querySelectorAll(".completa").forEach((item, index) => {

            item.onclick = () => {
                let completa = !resposta[index].completed;
                completarTarefa(resposta[index].id, completa);
                resposta[index].completed = completa;

                const divPai = item.parentElement.parentElement;
                if (completa) {
                    divPai.querySelector('h2').style.textDecoration = "line-through";
                    divPai.querySelectorAll("p").forEach((item)=> item.style.textDecoration = "line-through");

                } else {
                    divPai.querySelector('h2').style.textDecoration = "none";
                    divPai.querySelectorAll("p").forEach((item)=> item.style.textDecoration = "none");
                }

            }
        })



    }


}



async function completarTarefa(id, isCompleted) {

    if (id > 200) {
        console.log("id não existe na api");
    } else {

        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: isCompleted
            })
        });
        const data = await request.json();

        if (!request.ok) {
            console.log("erro da net");
        }

    }
}

function mostrarModalEditar(todo, pai) {


    modal.showModal();
    modal.querySelector(".cancelar-editcao").onclick = () => modal.close();
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.close();
        }
    };
   


    if (todo.descricao == null) {
        todo.descricao = "Sem descrição"
    
    }

    const mudarTitulo = document.querySelector(".titulo-editar")
    const mudarDescricao = document.querySelector(".descricao-editar")

    mudarTitulo.value = todo.title;
    mudarDescricao.value = todo.descricao;

    document.querySelector(".id-editar").innerHTML = `ID: ${todo.id}`;
    document.querySelector(".user-editar").innerHTML = `Usuário: ${todo.userId}`;

    document.querySelector(".atualizar").onclick = () => {
        const novoDado = {
            id: todo.id,
            userId: todo.userId,
            title: mudarTitulo.value,
            descricao: mudarDescricao.value
        }

        modal.close();
        atualizarTarefa(novoDado);
        pai.querySelector("h2").innerText = novoDado.title;
        pai.querySelector(".descricao").innerText = novoDado.descricao;

    }
}


// showModalResult()
async function atualizarTarefa(todo) {

    if (todo.id > 200) {
        console.log("usuário sem ser da api");
    } else {
        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });

        if (!request.ok) {
            console.log("erro da net");
        } else {
            const data = await request.json();
        }

    }
}

async function deletarTarefa(id) {
    if (id > 200) {
        console.log("user n api");
    } else {
        const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "DELETE",
        });
        if (!request.ok) {
            console.log("Erro ao deletar"); // n mostrou
        }
        const data = await request.json();

    }
}





function pesquisarTarefasUser() {
    pesquisar.onclick = (e) => {

        const id = Number(inputPesquisar.value);

        if (isNaN(id) || id === 0 || id > 10) { // tratei aq por preguça mas dá pra tratar no getAllToDosOfUser
            document.querySelector('.input-pesquisa-container').classList.add('input-pesquisa-container-erro');
        } else {
            getAllToDosOfUser(id);
            document.querySelector('.input-pesquisa-container').classList.remove('input-pesquisa-container-erro');
        }

    }

}



async function getAllToDosOfUser(userId) {
    carregando.style.display = "block";
    const container = document.querySelector(".container-tarefas");
    container.style.display = "none"

    tarefas.forEach((item) => item.style.display = "none")
    const request = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
    if (!request.ok) {
        console.log("erro na pesquisa");
    } else {
        const data = await request.json();
        container.innerHTML = "";
        for (let item of data) {
            container.insertAdjacentHTML('afterbegin',
                `<div class="tarefa" >
                    <div style="display: flex; align-items: center;">
                    <div class="dadosTodo">
                    <p class="userId">${item.userId}</p>
                    <h2>${item.title}</h2>
                    <p class="descricao">Sem descrição</p>
                    </div>
                    </div>
                    <div style="display: flex;">
                    <button class="completa"><img src="./imgs/icons8-check-30.png" alt="Completar"></button>
                <button class="editar"><img src="./imgs/icons8-edit-50.png" alt="Editar"></button>
                <button class="deletar"><img src="./imgs/icons8-trash-50.png" alt="Deletar"></button>
                </div>
                </div>`);
        }

        document.querySelectorAll(".tarefa").forEach((item, index) => {

            if (data[index].completed) {

                item.querySelector('h2').style.textDecoration = "line-through";
                item.querySelector("p").style.textDecoration = "line-through";
            } else {
                item.querySelector('h2').style.textDecoration = "none";
                item.querySelector("p").style.textDecoration = "none";
            }
        })

        document.querySelectorAll(".editar").forEach((item, index) => {


            item.onclick = () => {
                const pai = item.parentElement.parentElement;
                const dados = {
                    id: data[index].id,
                    userId: data[index].userId,
                    completed: data[index].completed,
                    title: pai.querySelector("h2").innerText,
                    descricao: pai.querySelector(".descricao").innerText
                }
        
                mostrarModalEditar(dados, pai);
            }
        })
        document.querySelectorAll(".deletar").forEach((item, index) => {

            item.onclick = () => {
                deletarTarefa(data[index].id);
                const pai = item.parentElement.parentElement;
                pai.remove();
            }
        })
        document.querySelectorAll(".completa").forEach((item, index) => {

            item.onclick = () => {
                let completa = !data[index].completed;
                completarTarefa(data[index].id, completa);
                data[index].completed = completa;

                const pai = item.parentElement.parentElement;
                if (completa) {
                    pai.querySelector('h2').style.textDecoration = "line-through";
                    pai.querySelectorAll("p").forEach(p => p.style.textDecoration = "line-through");
                } else {
                    pai.querySelector('h2').style.textDecoration = "none";
                    pai.querySelectorAll("p").forEach(p => p.style.textDecoration = "none");
                }

            }
        })

        carregando.style.display = "none";
        container.style.display = "block"

    }
}

