<template>
  <default-list-group :item="item" text sub-group />
</template>

<script>
import DefaultListGroup from "@/layouts/dashboard/components/ListGroup";
export default {
  name: "ListSubGroup",
  components: { DefaultListGroup },
  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
  },
};
</script>
