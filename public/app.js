new Vue({
  el: '#app',
  name: 'app',
  vuetify: new Vuetify({
    theme: { dark: true },
  }),
  data() {
    return {
      isDark: false,
      show: true,
      todoTitle: '',
      todos: []
    }
  },
  methods: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1)
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      }
      if (withTime) {
        options.hour = '2-digit',
          options.minute = '2-digit',
          options.seconds = '2-digit'
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
    },
    async removeTodo(id) {
      try {
        const query = `
          mutation {
            deleteTodo(id: "${id}")
          }
        `
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ query }),
        })
        if (response.ok) {
          this.todos = this.todos.filter(t => t.id !== id)
        } else {
          throw new Error()
        }
      } catch (err) {
        console.log('err: ', err)
      }
    },
    async addTodo() {
      const title = this.todoTitle.trim()
      if (!title) {
        return
      }
      const query = `
        mutation {
          createTodo(todo: {title: "${title}"}) {
            id title done createdAt updatedAt
          }
        }
      `
      try {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ query }),
        })
        if (response.ok) {
          const { data: { createTodo: todo } } = await response.json()
          this.todos.push(todo)
        } else {
          throw new Error()
        }

      } catch (err) {
        console.log('err: ', err)
      }
    },
    async getTodo() {
      const query = `
        query {
          getTodos {
            id title done createdAt updatedAt
          }
        }
      `
      try {
        const response = await fetch('/graphql', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ query })
        })

        if (response.ok) {
          const { data: { getTodos: todos } } = await response.json()
          this.todos.push(...todos)
        } else {
          throw new Error()
        }

      } catch (err) {
        console.log('err: ', err)
      }

    },
    async completeTodo(id) {
      const query = `
        mutation {
          completeTodo(id: "${id}") {
            id updatedAt
          }
        }
      `
      try {
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ query }),
        })

        if (response.ok) {
          const { data: { completeTodo: { id, updatedAt } } } = await response.json()
          const idx = this.todos.findIndex(t => t.id === id)
          this.todos[idx].updatedAt = updatedAt
        } else {
          throw new Error()
        }
      } catch (err) {
        console.log('err: ', err)
      }
    }
  },
  created() {
    this.getTodo()
  }
})