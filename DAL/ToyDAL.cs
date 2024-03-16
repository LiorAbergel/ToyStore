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
        public ToyDAL() : base("DatabaseConnection") {}

        public DbSet<Toy> Toys { get; set; } // Define DbSet for Toy model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<Toy>().ToTable("Toy");
            base.OnModelCreating(modelBuilder);
        }
    }
}