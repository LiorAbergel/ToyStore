using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.DAL
{
    public class ToyDAL : DbContext
    {
        public ToyDAL() : base("DatabaseConnection")
        {
            using (var CategoryDAL = new CategoryDAL())
            {
                foreach (var toy in Toys)
                {
                    toy.Category = CategoryDAL.Categories.FirstOrDefault(c => c.CategoryId == toy.CategoryId);
                }
            }
        }

        public DbSet<Toy> Toys { get; set; } // Define DbSet for Toy model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Toy>().ToTable("Toy");
            base.OnModelCreating(modelBuilder);
        }
    }
}