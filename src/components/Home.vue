<template>
    <h2>Последние публикации</h2>
    <div v-if="posts && posts.length > 0">
        <table>
            <thead>
                <td>id</td>
                <td>Автор</td>
                <td>Группа</td>
                <td>Текст</td>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post.id">
                    <td>{{ post.id }}</td>
                    <td>{{ post.user_name }}</td>
                    <td>{{ post.group_name }}</td>
                    <td>{{ post.text }}</td>
                </tr>
            </tbody>
        </table>
    </div>
<!--    <div v-else-if="posts && posts.length === 0">-->
<!--        <p>Публикации не найдены</p>-->
<!--    </div>-->
    <div v-else>
        <p>Загрузка...</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            posts: [],
        }
    },
    async mounted() {
        try {
            const res = await fetch('http://localhost:8000/api/post')


            let data = await res.json()

            this.posts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
            console.log(this.posts)
        } catch (error) {
            console.log(error)
        }
    },
}
</script>

<style scoped></style>
