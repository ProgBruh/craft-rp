<template>
  <div class="mt-5">
    <div class="is-size-5 has-text-weight-normal">
      Если у вас имеются какие-либо идеи, вопросы или предложения вы можете
      написать нам на:
    </div>
    <br />
    <div class="is-size-4 has-text-weight-semibold">
      Адрес электронной почты
    </div>
    <div class="is-size-4 has-text-weight-medium">
      <a :href="`mailto:${email}`">{{ email }}</a>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      email: process.env.SUPPORT_EMAIL,
    }
  },
}
</script>

<style lang="css" scoped></style>
