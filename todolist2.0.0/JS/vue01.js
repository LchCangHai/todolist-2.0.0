(function () {
    const storeName = "lists";
    let Storage = {
        fetch() {//取
            try {
                return JSON.parse(localStorage.getItem(storeName) || "[]");
            } catch(err) {
                return [];
            }
        },
        save(lists) {//存
            localStorage.setItem(storeName,JSON.stringify(lists));
        }
    }
    let visibility = 'all';
    let filters = {
        all : lists => lists,
        active : lists => lists.filter(item => !item.status),//status：是否完成，完成则为true
        completed : lists => lists.filter(item => item.status),
    }

    let app = new Vue({
        el : ".container",
        data : {
            lists : Storage.fetch(),
            newTodo : "",
            editTodo : null,
            cancelEditCache : "",
            visibility,
        },
        computed : {
            cnt_all() {
                return filters.all(this.lists).length;
            },
            cnt_active() {
                return filters.active(this.lists).length;
            },
            cnt_completed() {
                // console.log("filters.completed(this.lists).length  " + filters.completed(this.lists).length)
                return filters.completed(this.lists).length;

            },
            showLists() {
                return filters[this.visibility](this.lists);
            }

        },
        watch : {
            lists : {
                deep : true,
                handler : Storage.save
                // immediate
            }
        },
        methods : {
            addTodo() {
                let tem = this.newTodo.trim();
                if(!tem) {
                    return ;
                }
                this.lists.unshift({
                    content : tem,
                    status : false
                })
                this.newTodo = "";
            },
            edit_todo(item) {
                this.editTodo = item;
                this.cancelEditCache = item.content;
            },
            confirmEdit(item) {
                if(!this.editTodo) {
                    return ;
                }
                this.editTodo = "";
                let tem = item.content.trim();
                if(!tem) {
                    this.delete1(item);
                } else {
                    item.content = tem;
                }
            },
            cancelEdit(item) {
                if(this.editTodo) {
                    item.content = this.cancelEditCache;
                    this.editTodo = "";
                }
            },
            delete1(item) {
                let index = this.lists.indexOf(item);
                this.lists.splice(index , 1);
            },
            delete_completed() {
                this.lists = filters.active(this.lists);
            }
        },
        // 指令集合
        directives: {
            focus: {
                update(el) {
                    el.focus();
                }
            }
        },



})
})();

