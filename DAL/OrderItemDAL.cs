using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.DAL
{
    public class OrderItemDAL : DbContext
    {
        public OrderItemDAL() : base("DatabaseConnection") { } // Connection string name
        public DbSet<OrderItem> OrderItems { get; set; } // Define DbSet for OrderItem model

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = true;
            modelBuilder.Entity<OrderItem>().ToTable("OrderItem");
            base.OnModelCreating(modelBuilder);
        }
    }
}