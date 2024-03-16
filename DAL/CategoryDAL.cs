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
    }
}