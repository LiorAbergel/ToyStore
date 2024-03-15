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
        public ToyDAL() : base("DatabaseConnection") { } // Connection string name
        public DbSet<Toy> Toys { get; set; } // Define DbSet for Toy model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Toy>().ToTable("Toy");
            base.OnModelCreating(modelBuilder);
        }

    }
}