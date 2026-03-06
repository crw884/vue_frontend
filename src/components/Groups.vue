<template>
    <h2>Группы</h2>
    <div v-if="groups && groups.length > 0">
        <table>
            <thead>
                <td>id</td>
                <td>Название</td>
                <td>Админ</td>
            </thead>
            <tbody>
                <tr v-for="group in groups" :key="group.id">
                    <td>{{ group.id }}</td>
                    <td>{{ group.name }}</td>
                    <td>{{ group.admin }}</td>
                    <td>{{ group.description }}</td>

                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <p>Загрузка...</p>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                groups: []
            }
        },
        async mounted() {
            try {
                const res = await fetch('http://localhost:8000/api/group')


                this.groups = await res.json()


            } catch (error) {
                console.log(error)
            }
        }
    }
</script>

<style scoped></style>
