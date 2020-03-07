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
        active : lists => lists.filter(item => item.status),//status：是否完成，完成则为true
        completed : lists => lists.filter(item => !item.status),
    }

    let app = new Vue({
        el : ".container",
        data : {
            lists : Storage.fetch(),
            newTodo : "",
            editTodo : null,
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
                return filters.completed(this.lists).length;
            },
            showLists() {
                return filters[this.visibility](this.lists);
            },

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
                this.lists.push({
                    content : tem,
                    status : false
                })
                this.newTodo = "";
            }


        }

    })
})();

