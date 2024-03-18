using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.DAL
{
    public class OrderDAL : DbContext
    {
        public OrderDAL() : base("DatabaseConnection") { } // Connection string name
        public DbSet<Order> Orders { get; set; } 

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<Order>().ToTable("Order");
            base.OnModelCreating(modelBuilder);
        }
    }
}