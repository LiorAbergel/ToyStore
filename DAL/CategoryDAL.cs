using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.DAL
{
    public class CategoryDAL : DbContext
    {
        public CategoryDAL() : base("DatabaseConnection") { } // Connection string name
        public DbSet<Category> Categories { get; set; } // Define DbSet for Category model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<Category>().ToTable("Category");
            base.OnModelCreating(modelBuilder);
        }

        public void AddCategory(Category category)
        {
            Categories.Add(category);
            SaveChanges();
        }

        public void UpdateCategory(Category category)
        {
            Entry(category).State = EntityState.Modified;
            SaveChanges();
        }

        public void DeleteCategory(int id)
        {
            Category category = Categories.Find(id);
            Categories.Remove(category);
            SaveChanges();
        }

        public Category GetCategoryById(int id)
        {
            return Categories.Find(id);
        }

        public List<Category> GetCategoriesByName(string searchValue)
        {
            return Categories.Where(x => x.Name.Contains(searchValue)).ToList();
        }

        public List<Category> GetCategories()
        {
            return Categories.ToList();
        }
    }
}