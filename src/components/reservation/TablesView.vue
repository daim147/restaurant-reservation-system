<template>
  <div class="tables-view">
    <div v-if="reservableTables.length === 0" class="empty-state">
      <i class="empty-icon">📋</i>
      <p>No tables available for reservation</p>
    </div>
    <div v-else class="table-tags-container">
      <!-- Preview of tables (shows first 3) -->
      <div class="table-tags-preview" v-if="!showAllTables">
        <div v-for="table in visibleTables" :key="table.id" class="table-tag">
          {{ table.section_name }} - {{ table.name }}
        </div>
        <div class="table-tag view-more" v-if="hasMoreTables" @click="toggleShowAllTables">
          +{{ reservableTables.length - visibleCount }} more
        </div>
      </div>

      <!-- All tables (dropdown view) -->
      <div v-if="showAllTables" class="table-tags-dropdown">
        <div class="dropdown-header">
          <span>All Tables ({{ reservableTables.length }})</span>
          <button type="button" class="close-dropdown" @click="toggleShowAllTables">&times;</button>
        </div>
        <div class="tags-list">
          <div v-for="table in reservableTables" :key="table.id" class="table-tag">
            {{ table.section_name }} - {{ table.name }}
          </div>
        </div>
      </div>

      <p class="help-text">
        {{ reservableTables.length }} tables currently enabled for reservations
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablesView',
  props: {
    tables: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showAllTables: false,
      visibleCount: 3,
    };
  },
  computed: {
    reservableTables() {
      return this.tables.filter(table => table.accepts_reservations);
    },
    visibleTables() {
      return this.reservableTables.slice(0, this.visibleCount);
    },
    hasMoreTables() {
      return this.reservableTables.length > this.visibleCount;
    },
  },
  methods: {
    toggleShowAllTables() {
      this.showAllTables = !this.showAllTables;
    },
  },
};
</script>

<style src="./TablesView.css" scoped></style>
